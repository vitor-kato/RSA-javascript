<template>
  <div id="app">
    <p>Message:</p>
    <input v-model="message" placeholder="Change me" style="width: 80vmin; height: 3em">
    <br>
    <p>Encode:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ mEncode }}</textarea>
    <br>
    <p>Decode:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ mDecode }}</textarea>
    <br>
    <p>Bits: {{ bits }}</p>
    <div>
      <button @click="bits = 512">
      512
      </button>
      <button @click="bits = 1024">
      1024
      </button>
      <button @click="bits = 2048">
      2048
      </button>
    </div>
    <br>
    <div>
      <button @click="encode">
      encode
      </button>
      <button @click="decode">
      decode
      </button>
      <button @click="gen">
      New values
      </button>
    </div>
    <br>
    <p>PUBLIC KEY:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ publicKey }}</textarea>
    <br>
    <p>PRIVATE KEY:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ privateKey }}</textarea>
    <br>
    <p>p:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ p }}</textarea>
    <br>
    <p>q:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ q }}</textarea>
    <br>
    <p>n:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ n }}</textarea>
    <br>
    <p>e:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ e }}</textarea>
    <br>
    <p>d:</p>
    <textarea name="name" rows="8" cols="80" readonly>{{ d }}</textarea>
  </div>
</template>

<script>
// REFER TO https://www.di-mgt.com.au/rsa_alg.html#notespractical
// JSBN Library to for using big integers and its functions
const BigInteger = require('jsbn').BigInteger
const SecureRandom = require('jsbn').SecureRandom
const bytesCounter = require('bytes-counter')

const DEBUG = 0

let str = 'The information security is of significant importance to ensure the privacy of communications'

let r = new SecureRandom()
let k = 1024
let p = null
let q = null
let n = null
let d = null
let e = new BigInteger('65537') // Common value for e


//Debug with fixed values
if (DEBUG) {
  str = 'ASTHA GFG'
  p = new BigInteger('9417354079267843519')
  q = new BigInteger('13709100021983354407')
  n = new BigInteger('129103449015115825887075075156795038233')
  d = new BigInteger('77462069409069495518369172633326304185')
  e = new BigInteger('5')
}

function genKeys(k) {
  // Loops until prime is found
  do {
    // BigInteger(int bitLength, int isPrime?, Random rnd)
    p = new BigInteger(k/2, 100, r)
    // less-expensive test (p mod e) !== 1 since e is odd prime
  } while (!p.isProbablePrime() && p.mod(e) !== 1)
  do {
    q = new BigInteger(k - k / 2, 100, r)
  } while (!q.isProbablePrime() && q.mod(e) !==  1)

  n = p.multiply(q)

  // Calculate phi
  let phi = (p.subtract(BigInteger.ONE)).multiply(q.subtract(BigInteger.ONE))

  d = e.modInverse(phi)
}

//String to bytes
function unpack(str) {
  let result = []
    for (let i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i))
    }
    return result
}
//Bytes to string
function bin2String(array) {
  return String.fromCharCode.apply(String, array)
}
//Chunks arrays
function chunk(array, size) {
  const chunked_arr = []
  let index = 0
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index))
    index += size
  }
  return chunked_arr
}


export default {
  created () {
    this.gen(k)
  },

  watch: {
    bits (val) {
      k = val
      this.gen()
    },
  },

  data () {
    return {
      message: str,
      bits: k,
      mEncode: '',
      mDecode: '',
      publicKey: null,
      privateKey: null,
      p: null,
      q: null,
      n: null,
      e: null,
      d: null,
    }
  },

  //Here is where the magic happens -Encode -Decode
  methods: {
  	encode () {
      this.mEncode = '' //Clears on new execution
      this.mDecode = ''

      //Checks if the message wont break the encoding or decoding bytes size
      //This is only for proofing and need some refactoring
      if (this.bits === 512 && bytesCounter.count(this.message) >= 64) {
        let temp = unpack(this.message)
        temp = chunk(temp, 64) //Chunks
        temp.forEach(arr => {
          let string = new BigInteger(arr).modPow(e, n).toString() + '\n'
          this.mEncode += string
        })
      } else {
        this.mEncode = new BigInteger(unpack(this.message)).modPow(e, n).toString()
      }
    },
    decode () {
      let temp = this.mEncode.split('\n')

      if (temp.length > 1) { temp.pop() } // Removes unwanted newline char

      temp.forEach(arr => {
        let string = new BigInteger(arr).modPow(d, n).toByteArray()
        this.mDecode += bin2String(string)
      })
    },
    gen () {
      //Generates new keys
      genKeys(k)
      console.log('New keys set...')
      this.p = p
      this.q = q
      this.n = n
      this.e = e
      this.d = d

      // FIXME: placeholder format, not accurate at all!
      this.publicKey = "-----BEGIN RSA PUBLIC KEY-----" + btoa(n) + btoa(e) + "\n-----END PUBLIC KEY-----"
      this.privateKey = "-----BEGIN RSA PRIVATE KEY-----" + btoa(n) + btoa(d) + "\n-----END PRIVATE KEY-----"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
