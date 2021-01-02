import store from '@/store/index'

export default class API {

  constructor(url) {

    this.url = url

  }

  formatBytes(bytes, decimals = 2) {

    if (bytes === 0) return `0 B`;
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

  }
  
  dotify(number) {

    let reversedNumberAsString = String(number).split(``).reverse().join(``);
    let dotifiedNumber = ``;
    for (let i = 0; i < reversedNumberAsString.length; i++) {
      dotifiedNumber = `${reversedNumberAsString.charAt(i)}${(i%3===0 && i!=0) ? `.` : ``}${dotifiedNumber}`;
    }
    return dotifiedNumber;
    
  }

  connectToServer() {

    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log(`Socket opened!`)
    }

    this.socket.onmessage = this.handleMessage
    
  }

  handleMessage(message) {

    // console.log(`message:`, message);
    
    let parsed = JSON.parse(message.data)

    store.dispatch(`addPackets`, parsed)
    
  }

}