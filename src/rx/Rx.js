const { BehaviorSubject } = require('rxjs');

class Rx {
  constructor(defaultValue) {
    this.defaultValue = defaultValue;
    this.subject = new BehaviorSubject(defaultValue);
  }

  set(value) {
    return this.subject.next(value);
  }

  init() {
    return this.set(this.defaultValue);
  }

  get value() {
    return this.subject.value;
  }

  get observable() {
    return this.subject.asObservable();
  }
}

module.exports = Rx;