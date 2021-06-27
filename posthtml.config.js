/** We use Parcel and PostHTML with the 'posthtml-expressions' plugin to populate environment variables in HTML files.
 * @see https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-432424397
 */

module.exports = {
    plugins: {
        "posthtml-expressions": {
            locals: {
                URL_SITE: process.env.URL_SITE ?? 'localhost:1234',
            }
        }
    }
}