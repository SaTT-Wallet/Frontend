import { Injectable } from '@angular/core';
import snapshot from '@snapshot-labs/snapshot.js';
import { Web3Provider } from '@ethersproject/providers';
import { Buffer } from 'buffer';
import { environment as env } from '../../../../environments/environment';

declare global {
  interface Window {
    ethereum?: any
  }
}
(<any>window).Buffer = Buffer;

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  client = new snapshot.Client712(env.snapshot_hub);
  web3 = new Web3Provider(window.ethereum);
  account!: string[];

  constructor() {
    this.init();
  }

  async init() {
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
    }
  }

  async getBlockNumber() {
    const blockNumber = await snapshot.utils.getBlockNumber(this.web3);
    return blockNumber;
  }

  async createProposal(proposalData: any) {
    debugger
    let response: any = await this.client.proposal(this.web3, this.account[0], {
      from: this.account[0],
      space: env.space_name,
      type: 'single-choice',
      title: proposalData.title,
      body: proposalData.body,
      start: proposalData.start,
      end: proposalData.end,
      choices: proposalData.choices,
      snapshot: proposalData.snapshot,
      discussion: '',
      plugins: JSON.stringify({}),
      app: 'SaTT-Token',
    })
    console.log(response)
  }

  async castVote(proposalData: any) {
    const receipt = await this.client.vote(this.web3, this.account[0], {
      from: this.account[0],
      space: env.space_name,
      proposal: proposalData.id,
      type: 'single-choice',
      choice: proposalData.choiceNumber,
      app: 'SaTT-Token'
    });
    return receipt;
  }

  async getProposal(ipfsHash: string) {
    const proposal = await snapshot.utils.ipfsGet('snapshot.mypinata.cloud', ipfsHash);
    return proposal;
  }
}

