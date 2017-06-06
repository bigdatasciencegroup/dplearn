import {
  Component,
  OnInit,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import {
  Http,
  Response,
  Headers,
  RequestOptions,
} from '@angular/http';

import {
  Observable,
} from 'rxjs/Rx';

import {
  MdSnackBar,
} from '@angular/material';

export class MNISTRequest {
  type: number;
  text: string;
  constructor(
    tp: number,
    txt: string,
  ) {
    this.type = tp;
    this.text = txt;
  }
}

export class MNISTResponse {
  result: string;
}

@Component({
  selector: 'app-mnist',
  templateUrl: 'mnist.component.html',
  styleUrls: ['mnist.component.css'],
})
export class MNISTComponent implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
  mode = 'Observable';
  private mnistRequestEndpoint = 'mnist-request';

  inputValueI: string;
  inputValueII: string;

  mnistResponse: MNISTResponse;
  mnistResponseError: string;

  mnistResultI: string;
  mnistResultII: string;

  mnistIInProgress = false;
  spinnerColorI = 'primary';
  spinnerModeI = 'determinate';
  spinnerValueI = 0;

  mnistIIInProgress = false;
  spinnerColorII = 'primary';
  spinnerModeII = 'determinate';
  spinnerValueII = 0;

  constructor(private http: Http, public snackBar: MdSnackBar) {
    this.inputValueI = '';
    this.inputValueII = '';
    this.mnistResponseError = '';
    this.mnistResultI = 'Nothing to show...';
    this.mnistResultII = 'Nothing to show...';
  }

  ngOnInit(): void {}
  ngAfterContentInit() {}
  ngAfterViewInit() {}
  ngAfterViewChecked() {}

  // user leaves the template
  ngOnDestroy() {
    console.log('Disconnected from cluster (user left the page)!');
    return;
  }

  processMNISTResponseI(resp: MNISTResponse) {
    this.mnistResponse = resp;
    this.mnistResultI = resp.result;
    this.mnistIInProgress = false;
  }
  processMNISTResponseII(resp: MNISTResponse) {
    this.mnistResponse = resp;
    this.mnistResultII = resp.result;
    this.mnistIIInProgress = false;
  }

  processHTTPResponseClient(res: Response) {
    let jsonBody = res.json();
    let mnistResponse = <MNISTResponse>jsonBody;
    return mnistResponse || {};
  }

  processHTTPErrorClient(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    this.mnistResponseError = errMsg;
    return Observable.throw(errMsg);
  }

  postRequest(mnistRequest: MNISTRequest): Observable<MNISTResponse> {
    let body = JSON.stringify(mnistRequest);
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({headers : headers});

    // this returns without waiting for POST response
    let obser = this.http.post(this.mnistRequestEndpoint, body, options)
      .map(this.processHTTPResponseClient)
      .catch(this.processHTTPErrorClient);
    return obser;
  }

  processRequestI() {
    let val = this.inputValueI;
    let mnistRequest = new MNISTRequest(1, val);
    let mnistResponseFromSubscribe: MNISTResponse;
    this.postRequest(mnistRequest).subscribe(
      mnistResponse => mnistResponseFromSubscribe = mnistResponse,
      error => this.mnistResponseError = <any>error,
      () => this.processMNISTResponseI(mnistResponseFromSubscribe), // on-complete
    );
    this.snackBar.open('Predicting correct words...', 'Requested!', {
      duration: 2000,
    });
    this.mnistIInProgress = true;
    this.spinnerModeI = 'indeterminate';
  }
  processRequestII() {
    let val = this.inputValueII;
    let mnistRequest = new MNISTRequest(2, val);
    let mnistResponseFromSubscribe: MNISTResponse;
    this.postRequest(mnistRequest).subscribe(
      mnistResponse => mnistResponseFromSubscribe = mnistResponse,
      error => this.mnistResponseError = <any>error,
      () => this.processMNISTResponseII(mnistResponseFromSubscribe), // on-complete
    );
    this.snackBar.open('Predicting next words...', 'Requested!', {
      duration: 2000,
    });
    this.mnistIIInProgress = true;
    this.spinnerModeII = 'indeterminate';
  }
}