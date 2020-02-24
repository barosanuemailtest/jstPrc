import { isInternalLink } from '../src/main'

beforeAll(() => {
    console.log('beforeAll');
});
beforeEach(() => {
    console.log('beforeEach');
});
afterAll(() => {
    console.log('afterEach');
});

test('should return false given external link', () => {
    console.log('should return false given external link')
    expect(isInternalLink('https://google.com')).toBe(false)
})

test('should return true given internal link', () => {
    console.log('should return true given internal link')
    expect(isInternalLink('/some-page')).toBe(true)
})
