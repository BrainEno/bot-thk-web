import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Index from '../src/pages/index'

jest.mock('next/router', () => require('next-router-mock'))

describe('test-headline-render', () => {
    it('should have Featured text', () => {
        render(<Index recent={[]} featured={[]} trending={[]} />) //ARRANGE

        const myElem = screen.getByText('Featured')

        expect(myElem).toBeInTheDocument()
    })
})
