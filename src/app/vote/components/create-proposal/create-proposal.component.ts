import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetaMaskService } from '../../../core/services/vote/meta-mask.service';
import { FormControl, FormGroup, FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Proposal } from '@app/models/proposal.model';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import { SnapshotService } from '@app/core/services/vote/snapshot.service';
import { Web3Provider } from '@ethersproject/providers';


declare global {
  interface Window {
    ethereum?: any
  }
}

interface Choice {
  value: string;
}


@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss']
})
export class CreateProposalComponent implements OnInit, OnDestroy {

  createProposalObj: Proposal = {
    type: 'single-choice' as ProposalType,
  }
  web3 = new Web3Provider(window.ethereum);
  account!: string[];

  // public walletConnected: boolean = false;
  public walletConnected!: boolean;
  public walletId: string = '';
  checkWallet: any;

  snapshot!: any;
  provider!: any;
  choiceValue: string = '';
  proposalForm: FormGroup | undefined;
  bodyText!: string;

  choices: Choice[] = [{ value: '' }, { value: '' }]; // Default choices array

  addChoice() {
    this.choices.push({ value: '' }); // Add a new choice to the array
  }

  removeChoice(index: number) {
    this.choices.splice(index, 1); // Remove the choice at the given index
  }

  onInputChange(event: any) {
    this.choiceValue = event.target.value;
  }

  editor = new Editor();

  toolbar: Toolbar = [
    ['bold', 'italic'],
    // ['underline', 'strike'],
    ['blockquote'],
    ['bullet_list', 'ordered_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link']
  ];

  constructor(private snapshotService: SnapshotService, public metaMaskService: MetaMaskService, private http: HttpClient, private fb: FormBuilder, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.editor = new Editor();
    setInterval(async () => {
      await this.checkWalletConnected();
    }, 500);
    this.snapshot = await this.snapshotService.getBlockNumber();
  }
  ngOnDestroy() {

  }
  removeHTMLAttributes(htmlString: string): string {
    return htmlString.replace(/<[^>]*>/g, '');
  }
  // addChoice() {
  //   this.choices.push({ text: '' });
  // }
  choicesArray = new FormArray([
    new FormControl('', [Validators.required])
  ]);

  createProposalForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),

    choices: this.choicesArray,
    startDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  get formattedContent() {
    const prev = this.removeHTMLAttributes(this.choiceValue)
    if (prev.trim() === "") {
      return null;
    }
    else {
      return this.choiceValue
    }
  }

  isButtonDisabled(): boolean {
    const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
    const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
    return startDateTime >= endDateTime;
  }

  updateContent() {
    if (this.createProposalForm.controls.body.value !== null) {
      this.choiceValue = this.createProposalForm.controls.body.value;
    }
  }

  checkWalletConnected = async () => {
    const accounts = await this.metaMaskService.checkWalletConnected();
    if (accounts.length > 0) {
      this.walletConnected = true;
      this.walletId = accounts[0];
    }
  }

  connectWallet = async () => {
    this.provider = await this.metaMaskService.connectWallet();
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
      localStorage.setItem("accounts", this.account[0])
      await this.metaMaskService.connectWallet();
      await this.checkWalletConnected();
    }

    const dialogElement = document.querySelector('dialog');
    if (dialogElement) {
      dialogElement.close();
    }
  }


  publish() {
    debugger
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(this.createProposalForm.value.body ?? '', 'text/html');
    this.bodyText = parsedHtml.body.textContent ? parsedHtml.body.textContent : '';
    this.createProposalObj.title = this.createProposalForm.value.title ?? '';
    this.createProposalObj.body = this.bodyText;
    const choiceTexts = this.choices.map(choice => choice.value);
    this.createProposalObj.choices = choiceTexts;
    const startDateTime = new Date(`${this.createProposalForm.value.startDate} ${this.createProposalForm.value.startTime}`);
    const endDateTime = new Date(`${this.createProposalForm.value.endDate} ${this.createProposalForm.value.endTime}`);
    this.createProposalObj.start = (startDateTime.getTime()) / 1000;
    this.createProposalObj.end = (endDateTime.getTime()) / 1000;
    this.createProposalObj.from = localStorage.getItem("accounts") || "aa",
      this.createProposalObj.space = "atayen.eth",
      this.createProposalObj.type = 'single-choice' as ProposalType,
      this.createProposalObj.snapshot = this.snapshot,
      this.createProposalObj.app = "SaTT-Token"
    console.log(this.createProposalObj);
    this.snapshotService.createProposal(this.createProposalObj)
  }
}
