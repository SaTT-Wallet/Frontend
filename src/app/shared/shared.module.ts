import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegisterComponent } from '@shared/components/header-register/header-register.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingLogoComponent } from '@shared/components/loading-logo/loading-logo.component';
import { CodeInputAuthComponent } from '@shared/components/code-input-auth/code-input-auth.component';
import { CodeInputModule } from 'angular-code-input';
import { CopyTransactionHashComponent } from './components/copy-transaction-hash/copy-transaction-hash.component';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateInputConverterDirective } from '@shared/directives/date-input-converter.directive';
import { EarnedSattPipe } from '@shared/pipes/earned-satt.pipe';
import { TransfomNumberPipe } from '@shared/pipes/transfom-number.pipe';
import { ClickElseWhereDirective } from '@shared/directives/click-else-where.directive';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';
import { ConvertToWeiPipe } from '@shared/pipes/convert-to-wei.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FileUploadModule } from 'ng2-file-upload';
import { CustomFormsModule } from 'ng2-validation';
import { TagInputModule } from 'ngx-chips';
import { NgxEditorModule } from 'ngx-editor';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { CountdownModule } from 'ngx-countdown';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FarmPostCardComponent } from '@app/campaigns/components/farm-post-card/farm-post-card.component';
import { ResetBtnDirective } from '@shared/components/multi-select/reset-btn.directive';
import { OptionDirective } from '@shared/components/multi-select/option.directive';
import { ItemsListDirective } from '@shared/components/list-items/items-list.directive';
import { ListItemsComponent } from '@shared/components/list-items/list-items.component';
import { OrderByPipe } from '@shared/pipes/order-by.pipe';
import { UserPictureComponent } from './components/user-picture/user-picture.component';
import { InstagramPostDirective } from './directives/instagram-post.directives';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToFixedPipe } from './pipes/to-fixed.pipe';
import { ShowNumbersRule } from './pipes/showNumbersRule';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { FilterBynamePipe } from './pipes/filter-byname.pipe';
import { FooterSendReceiveBuyComponent } from '@app/wallet/components/footer-send-receive-buy/footer-send-receive-buy.component';
import { DropdownCryptoNetworkComponent } from '@app/wallet/components/dropdown-crypto-network/dropdown-crypto-network.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MoonboyHelpComponent } from './components/moonboy-help/moonboy-help.component';
import { WheelMouseDirective } from './directives/wheelMouse.directive';
import { BuyGasComponent } from './components/buy-gas/buy-gas.component';
import { QRCodeComponent } from './components/qr-code/qr-code.component';
import { RoiModalComponent } from '@app/src/app/campaigns/components/roi-modal/roi-modal.component';
import { InputRoiModalComponent } from '../src/app/campaigns/components/input-roi-modal/input-roi-modal.component';
import { TimePipe } from './pipes/time.pipe';
import { StripPipe } from './pipes/strip.pipe';

@NgModule({
  declarations: [
    HeaderRegisterComponent,
    FooterComponent,
    RoiModalComponent,
    FooterSendReceiveBuyComponent,
    LoadingLogoComponent,
    CodeInputAuthComponent,
    CopyTransactionHashComponent,
    CustomDropdownComponent,
    ListItemsComponent,
    DateInputConverterDirective,
    EarnedSattPipe,
    TransfomNumberPipe,
    ClickElseWhereDirective,
    CapitalizePhrasePipe,
    ConvertToWeiPipe,
    ConvertFromWei,
    ItemsListDirective,
    ResetBtnDirective,
    OptionDirective,
    FarmPostCardComponent,
    OrderByPipe,
    UserPictureComponent,
    InstagramPostDirective,
    MultiSelectComponent,
    ToFixedPipe,
    ShowNumbersRule,
    BlockCopyPasteDirective,
    FilterBynamePipe,
    DropdownCryptoNetworkComponent,
    MoonboyHelpComponent,
    WheelMouseDirective,
    BuyGasComponent,
    QRCodeComponent,
    InputRoiModalComponent,
    TimePipe,
    StripPipe
  ],
  exports: [
    //directives and components
    FilterBynamePipe,
    RoiModalComponent,
    TimePipe,
    StripPipe,
    HeaderRegisterComponent,
    FooterComponent,
    LoadingLogoComponent,
    CodeInputAuthComponent,
    CopyTransactionHashComponent,
    CustomDropdownComponent,
    ListItemsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    Ng2SearchPipeModule,
    NgCircleProgressModule,
    NgxPaginationModule,
    DateInputConverterDirective,
    WheelMouseDirective,
    EarnedSattPipe,
    OrderByPipe,
    TransfomNumberPipe,
    ClickElseWhereDirective,
    CapitalizePhrasePipe,
    ConvertToWeiPipe,
    ConvertFromWei,
    ItemsListDirective,
    ResetBtnDirective,
    OptionDirective,
    UserPictureComponent,
    MultiSelectComponent,
    ToFixedPipe,
    BlockCopyPasteDirective,
    MoonboyHelpComponent,
    // modules
    CarouselModule,
    CustomFormsModule,
    UiSwitchModule,
    NgxEditorModule,
    FileUploadModule,
    TagInputModule,
    NgbModule,
    ImageCropperModule,
    MatSnackBarModule,
    ClipboardModule,
    InputsModule,
    NgMultiSelectDropDownModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    MatSliderModule,
    DragScrollModule,
    MatListModule,
    CountdownModule,
    NgbModalModule,
    // NgxMatSelectModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    //TabsModule
    CodeInputModule,
    InfiniteScrollModule,
    FarmPostCardComponent,
    InstagramPostDirective,
    ShowNumbersRule,
    FooterSendReceiveBuyComponent,
    DropdownCryptoNetworkComponent,
    TranslateModule,
    BuyGasComponent,
    QRCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CodeInputModule,
    TranslateModule,
    RouterModule,
    NgxPaginationModule,
    ChartsModule,
    ClipboardModule,
    CarouselModule
  ],
  providers: [ConvertFromWei]
})
export class SharedModule {}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
