import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { makeId } from '../../helpers/makeId'

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
            storage: createJSONStorage(() => localStorage),
        }
    )
)
