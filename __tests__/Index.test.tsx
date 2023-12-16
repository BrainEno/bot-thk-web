import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Index from '../src/pages/index'

jest.mock('next/router', () => require('next-router-mock'))

describe('test-headline-render', () => {
    it('should have footer text', () => {
        render(<Index recent={[]} featured={[]} trending={[]} />) //ARRANGE

        const myElem = screen.getByText(
            'Copyright © 2021 BOT THK. All rights reserved.'
        )

        expect(myElem).toBeInTheDocument()
    })
})
