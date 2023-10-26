import { useCallback, useEffect, useRef } from 'react'

type DraftPayload = {
    id: string
    title: string
    body: string
    tags: string[]
    active: boolean
}

export const useIndexDB = () => {
    const dbRef = useRef<IDBDatabase | null>(null)

    const makeTransaction = useCallback(
        (storeName: string, mode?: IDBTransactionMode) => {
            if (!dbRef.current) return
            const db = dbRef.current
            const transaction = db.transaction(storeName, mode)

            transaction.onerror = (err) => {
                console.warn(err)
            }

            return transaction
        },
        []
    )

    const add = useCallback(
        (draft: DraftPayload) => {
            const transaction = makeTransaction('drafts', 'readwrite')

            if (!transaction) return

            transaction.oncomplete = () => {
                console.log('add transation complete')
            }

            const store = transaction.objectStore('drafts')
            const request = store.add(draft)

            request.onsuccess = () => {
                console.log('success added an object')
            }

            request.onerror = (err) => {
                console.log('error in request to add', err)
            }
        },
        [makeTransaction]
    )

    const get = useCallback(
        (id: string): DraftPayload | null => {
            const transaction = makeTransaction('drafts', 'readonly')

            if (!transaction) return null

            transaction.oncomplete = () => {
                console.log('get transation compelte')
            }

            const store = transaction.objectStore('drafts')

            if (id) {
                const getReq = store.get(id)

                getReq.onsuccess = () => {
                    return getReq.result as DraftPayload
                }

                getReq.onerror = (err) => {
                    console.warn(err)
                }
            }

            return null
        },
        [makeTransaction]
    )

    const edit = useCallback(
        (id: string, payload: DraftPayload) => {
            const transaction = makeTransaction('drafts', 'readwrite')

            if (!transaction) return

            transaction.oncomplete = () => {
                console.log('edit transaction complete')
            }

            const store = transaction.objectStore('drafts')

            if (id) {
                const request = store.get(id)
                request.onsuccess = () => {
                    const serialized = JSON.parse(
                        JSON.stringify(payload)
                    ) as DraftPayload
                    const updateReq = store.put(serialized)
                    updateReq.onsuccess = () => {
                        console.log('success updated an object')
                        return request.result
                    }
                }

                request.onerror = (err) => {
                    console.log('error in request to edit ', id, err)
                }
            }
        },
        [makeTransaction]
    )

    useEffect(() => {
        if (window !== undefined) {
            const request = window.indexedDB.open('BlogDraftDB', 1)

            request.addEventListener('error', (err) => {
                console.warn('idb error', err)
            })

            request.addEventListener('success', () => {
                console.log('idb success')
                dbRef.current = request.result
            })

            request.addEventListener('upgradeneeded', (event) => {
                dbRef.current = request.result
                const db = dbRef.current
                const { oldVersion } = event
                const newVersion = event.newVersion || db.version

                console.log(
                    'DB updated from version ',
                    oldVersion,
                    ' to ',
                    newVersion
                )

                if (!db.objectStoreNames.contains('drafts')) {
                    const objectStore = db.createObjectStore('drafts', {
                        keyPath: 'id',
                    })

                    objectStore.createIndex('id', 'id', { unique: true })
                    objectStore.createIndex('title', 'title', { unique: false })
                }
            })
        }
    }, [])

    return { add, get, edit }
}
