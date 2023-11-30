import { produce } from 'immer'
import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { makeId } from '../../helpers/makeId'
import localforage from 'localforage'

export interface ISearchItem {
    id: string
    searchText: string
    searchedAt: Date
}

interface SearchState {
    searchItems: ISearchItem[]
    add: (text: string) => void
    remove: (text: string) => void
    clear: () => void
}

export const localforageStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await localforage.getItem(name)) || null
    },
    setItem: async (name: string, value: string) => {
        await localforage.setItem(name, value)
    },
    removeItem: async (name: string) => {
        await localforage.removeItem(name)
    },
}

export const useSearchStore = create(
    persist(
        immer<SearchState>((set) => ({
            searchItems: [],
            add: (text: string) =>
                set(
                    produce((state: SearchState) => {
                        const index = state.searchItems.findIndex(
                            (i) => i.searchText === text
                        )

                        if (index === -1 && text.trim() !== '') {
                            state.searchItems = [
                                {
                                    id: makeId(),
                                    searchText: text,
                                    searchedAt: new Date(),
                                },
                                ...state.searchItems,
                            ]
                        }
                        if (index !== -1) {
                            state.searchItems[index].searchedAt = new Date()
                        }
                    })
                ),
            remove: (text: string) =>
                set((state) => {
                    const index = state.searchItems.findIndex(
                        (i) => i.searchText === text
                    )
                    if (index !== -1) {
                        state.searchItems.splice(index, 1)
                    }
                }),
            clear: () =>
                set((state) => {
                    state.searchItems = []
                }),
        })),
        {
            name: 'search-cache',
            storage: createJSONStorage(() => localforageStorage),
        }
    )
)
