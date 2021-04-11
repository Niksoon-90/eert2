import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymantIasService {

  payment = {
    allCorrespondensRouteId: 0,
    forecastCorrespondence: 0,
    smallCorrespondence: 0
  }

  getPaymentInformation() {
    return this.payment;
  }

  settPaymentAllCorrespondensRouteId(allCorrespondensRouteId) {
    this.payment.allCorrespondensRouteId = allCorrespondensRouteId;
  }
  settPaymentForecastCorrespondence(forecastCorrespondence) {
    this.payment.forecastCorrespondence = forecastCorrespondence;
  }
  settPaymentSmallCorrespondence(smallCorrespondence) {
    this.payment.smallCorrespondence = smallCorrespondence;
  }
}
