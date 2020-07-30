import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'

import App from '../App.svelte'

test('on page load there should be Welcome text', () => {
    const  { getByText } = render(App)

    expect(getByText('Welcome to the HEG Monitor!')).toBeInTheDocument()
})
