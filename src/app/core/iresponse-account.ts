export interface IresponseAccount {
  code: number;
  data: {
    hasWalletV2: boolean;
    migrated: boolean;
    idUser: number;
    email: string;
    additionalAddress: string;
    address: string;
    biography: string;
    birthday: Date;
    city: string;
    completed: undefined;
    country: string;
    enabled: number;
    fbLink: string;
    firstName: string;
    gender: string;
    gplusLink: string;
    idOnSn: number;
    idOnSn2: number;
    idOnSn3: number;
    idSn: string;
    instagramLink: string;
    is2FA: boolean;
    isEntreprise: string;
    lastName: string;
    linkedinLink: string;
    newEmail: string;
    newsLetter: true;
    ntva: string;
    onBoarding: true;
    organisation: string;
    passphrase: true;
    phone: IresponseAccountPhoneNumber;
    photoUpdated: boolean;
    picLink: string;
    recieveNews: string;
    tikTokLink: string;
    twitterLink: string;
    userPicture: string;
    userSatt: boolean;
    visitPassphrase: boolean;
    youtubeLink: string;
    zipCode: string;
    message: string;
    new?: boolean;
  };
  error?: string;
  message?: string;
}
export interface IresponseAccountPhoneNumber {
  phoneNumber: string;
  internationalNumber: string;
  nationalNumber: string;
}
