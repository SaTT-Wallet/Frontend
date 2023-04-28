export class User {
  public idUser!: string;
  public idSn: number;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public birthday: Date | string;
  public phone!: string;
  public address!: string;
  public zipCode!: string;
  public city!: string;
  public country!: string;
  public gender!: string;
  public organisation!: string;
  public ntva!: string;
  public recieveNews!: string;
  public fbLink!: string;
  public linkedinLink!: string;
  public twitterLink!: string;
  public gplusLink!: string;
  public instagramLink!: string;
  public youtubeLink!: string;
  public isEntreprise!: boolean;
  public userPicture!: any;
  public additionalAddress!: any;
  public biography!: string;
  public tikTokLink!: string;
  public picLink!: string;
  public idOnSn2!: string;
  public idOnSn!: string;
  public idOnSn3!: string;
  public newEmail!: object;
  public onBoarding!: boolean;
  public enabled: any;
  public is2FA!: boolean;
  public completed: any;
  public visitPassphrase: any;
  public newsLetter: any;
  public userSatt: any;
  public photoUpdated: any;
  public passphrase: any;
  public visitsocialAccounts: any;
  public hasWallet: boolean;
  public toggle: boolean;
  public lastLogin : any;
  new: string;
  error: any;

  visitedFacebook: boolean;
  visitedLinkedIn: boolean;
  visitedTwitter: boolean;
  visitedYoutube: boolean;
  visitedTiktok: boolean;

  constructor(data: any) {
    this.idUser = data._id;
    this.idSn = data.idSn;
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.birthday = data.birthday ? new Date(data.birthday) : '';
    this.lastLogin =data.updatedAt || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.zipCode = data.zipCode;
    this.city = data.city || '';
    this.country = data.country || '';
    this.gender = data.gender || '';
    this.organisation = data.organisation || '';
    this.ntva = data.NTVA || '';
    this.recieveNews = data.recieveNews || '';
    this.fbLink = data.fbLink || '';
    this.linkedinLink = data.linkedinLink || '';
    this.twitterLink = data.twitterLink || '';
    this.gplusLink = data.gplusLink || '';
    this.instagramLink = data.instagramLink || '';
    this.youtubeLink = data.youtubeLink || '';
    this.isEntreprise = data.isEntreprise || '';
    this.userPicture = '' || '';
    this.additionalAddress = data.additionalAddress || '';
    this.biography = data.biography || '';
    this.tikTokLink = data.tikTokLink || '';
    this.picLink = data.picLink;
    this.onBoarding = data.onBoarding || '';
    this.idOnSn3 = data.idOnSn3;
    this.idOnSn2 = data.idOnSn2;
    this.idOnSn = data.idOnSn;
    this.enabled = data.enabled;
    this.newEmail = data.newEmail?.email || '';
    this.is2FA = data.is2FA || false;
    this.completed = data.completed;
    this.visitPassphrase = data.visitPassphrase || '';
    this.visitsocialAccounts = data.visitsocialAccounts || '';
    this.toggle = data.toggle;
    this.newsLetter = data.newsLetter || '';
    this.userSatt = data.userSatt || '';
    this.photoUpdated = data.photoUpdated;
    this.passphrase = data.passphrase;
    this.new = data?.new;
    this.hasWallet = data?.hasWallet;
    this.visitedFacebook = data['visited-facebook'];
    this.visitedLinkedIn = data['visited-linkedIn'];
    this.visitedTwitter = data['visited-twitter'];
    this.visitedYoutube = data['visited-youtube'];
    this.visitedTiktok = data['visited-tiktok'];
  }

  public getAge() {
    let timeDiff = Math.abs(Date.now() - new Date(this.birthday).getTime());
    let age: number = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }

  public getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
  public getUserId() {
    return this.idUser;
  }
  public getLastLogin(){
  
    return this.lastLogin;
  }
}
