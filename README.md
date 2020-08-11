# Node Esios APi

![Node.js CI](https://github.com/alvaro-octal/node-esios-api/workflows/Node.js%20CI/badge.svg) [![Documentation](https://github.com/alvaro-octal/node-esios-api/workflows/Documentation/badge.svg)](https://alvaro-octal.github.io/node-esios-api/) [![NPM Version](https://badge.fury.io/js/esios-api.svg)](https://www.npmjs.com/package/esios-api)

Unofficial [esios](https://www.esios.ree.es/es) api client for NodeJS and web

## Installation

```bash
npm install --save esios-api
```

## Usage

```javascript
import EsiosApi from 'esios-api';

let esios = new EsiosApi('<YOUR_API_KEY>');

esios.getRecordsOfDay(date).then((records) => {
    console.log(records);

    //  [{
    //      date: Date,
    //      hour: 0-23,
    //      prices: {
    //          gen: 123.00,
    //          noc: 231.00,
    //          vhc: 312.00
    //      }
    //  }, ...]
});
```

## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
