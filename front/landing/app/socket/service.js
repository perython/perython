import Service from 'backbone.service';
import SockJS from 'sockjs-client';
import config from '../config';

const AuthService = Service.extend({
  setup() {
    this.timeSleep = 100;
    this.sock = new SockJS(config.sock);
    this.sock.onopen = this.onOpen;
    this.sock.onmessage = this.onMessage;
    this.sock.onclose = this.onClose;
  },

  requests: {
  },

  onOpen() {
    this.send(JSON.stringify({type: 'landing'}));
  },

  onClose() {
    // auto reconnect
    setTimeout(() => {
      this.sock = new SockJS(config.sock);
      this.sock.onopen = this.onOpen;
      this.sock.onmessage = this.onMessage;
      this.sock.onclose = this.onClose;

      if (this.timeSleep < 5000) {
        this.timeSleep = this.timeSleep * 2;
      }
    }, this.timeSleep);
  },

  onMessage(e) {
    console.log(e);
  }
});

export default new AuthService();
