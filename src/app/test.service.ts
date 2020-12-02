import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  or = {
    step1: null,
    step2: null,
  }
  tt ={
    step1: null
  }

  summ= {
    result: null
  }



  senderNameOld(item) {
  item['senderName'] = null
  this.tt.step1 = JSON.stringify(item);
  return true
}
  receiverNameOld(item) {
    item['receiverName'] = null
    this.tt.step1 = JSON.stringify(item);
    return true
  }

}
