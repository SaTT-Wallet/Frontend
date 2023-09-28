import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { Title, Meta } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as CryptoActions from '../../store/actions/crypto.actions';
import { selectCryptoData } from '@app/wallet/store/selectors/crypto.selectors';
import { CryptoData } from '@app/models/crypto-data.model';
import { selectCryptoPriceList } from '@app/core/store/crypto-prices/selectors/crypto.selectors';

@Component({
  selector: 'app-crypto-market-cap',
  templateUrl: './crypto-market-cap.component.html',
  styleUrls: ['./crypto-market-cap.component.scss']
})
export class CryptoMarketCapComponent implements OnInit {
  cryptoPriceList: any[] | null | undefined;
  cryptoLists: any;
  cryptoData$ = this.store.select(selectCryptoData);
  filteredCryptoListId: any[] = [];
  sparklineIn7dCryptoList: any[] = [];
  virtualScrollerData: any[] = [];
  filteredCryptoList: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 100;
  totalItems = 0;
  paginatedCryptoList: any[] = [];
  pagesPerPage = 8;
  data: any;
  globalMarketCap: any;
  searchQuery: string = '';
  public chart: any;

  maxButtonsPerPage = 15; 

  
  currentPageRangeStart = 1;

  lineChartOptions: ChartOptions = {
    aspectRatio: 2.5,
    responsive: true,
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      scaleLabel: {
        fontColor: 'red'
      },

      xAxes: [
        {
          display: false,
          gridLines: {
            color: 'transparent'
          }
        }
      ],
      yAxes: [
        {
          display: false,

          gridLines: {
            color: 'transparent'
          }
        }
      ]
    }
  };
  lineChartType: ChartType = 'line';
  lineChartLegend = false;
  private ngUnsubscribe = new Subject<void>();
  prices: any[] | undefined;
  cryptoIds: any[] = [];
  currentPageRangeEnd!: number;
  constructor(
    private router: Router,
    private fetchservice: CryptofetchServiceService,
    private titleService: Title,
    private metaService: Meta,
    private store: Store
  ) {
    this.cryptoIds = []; 
    // this.pageWindows = this.getPageWindow(this.currentPage);
  }

  ngOnInit(): void {
    this.setMaxButtonsPerPage();

    this.paginatedCryptoList = [];
    this.titleService.setTitle('SaTT-Market Cap');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover the best options in the cryptocurrency market and maximize your investments.'
    });
    this.metaService.addTag({
      name: 'keywords',
      content: 'cryptocurrency, Coin, Market Cap, investment, crypto, earning'
    });
    this.metaService.addTag({
      property: 'og:image',
      content: 'assets/Images/global-market-cap-cov.png'
    });
    this.metaService.addTag({
      name: 'twitter:card',
      content: 'assets/Images/global-market-cap-cov.png'
    });

    this.cryptoData$ = this.store.select(selectCryptoData);

    this.cryptoData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((cryptoData) => {
        if (!cryptoData || cryptoData.length === 0) {
          console.log('Dispatching loadCryptoData action...');
          this.store.dispatch(CryptoActions.loadCryptoData());
        } else {
          const dataArray = Object.values(cryptoData);
          this.cryptoLists = dataArray.slice(0, 100)[2];
          this.filterCryptos();

        }
      });

  }



  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setMaxButtonsPerPage();
  }

  private setMaxButtonsPerPage(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 530) {
      this.maxButtonsPerPage = 5;
    } else if (screenWidth <= 768) {
      this.maxButtonsPerPage = 10;
    } else if (screenWidth <= 992) {
      this.maxButtonsPerPage = 15;
    } else {
      this.maxButtonsPerPage = 20;
    }

    this.currentPageRangeEnd = this.maxButtonsPerPage;

  }

  /**
   * Split an array into chunks of a specific size.
   * @param arr The original array to split.
   * @param chunkSize The size of each chunk.
   * @returns A new array containing the chunks.
   */
  getArrayChunks<T>(arr: T[], chunkSize: number): T[][] {
    let results: T[][] = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      results.push(arr.slice(i, i + chunkSize));
    }

    return results;
  }

  // generatePageArray(totalPages: number): number[] {
  //   return Array.from({ length: totalPages }, (_, i) => i + 1);
  // }

  // get pagesArray(): number[] {
  //   return Array(this.totalPages)
  //     .fill(0)
  //     .map((_, i) => i + 1);
  // }
  filterCryptos(): Observable<number[]> {
    this.totalItems = this.cryptoLists?.length;
    // Check if the search query is empty
    if (!this.searchQuery) {
      if (Array.isArray(this.cryptoLists)) {
        this.cryptoLists.sort((a, b) => Number(a[1].cmc_rank) - Number(b[1].cmc_rank));
    
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCryptoList = this.cryptoLists.slice(startIndex, endIndex);
        this.cryptoIds = this.paginatedCryptoList.map((crypto) => crypto[1].id);

      } else if (
        this.cryptoLists !== null &&
        typeof this.cryptoLists === 'object'
      ) {
        this.cryptoLists = Object.keys(this.cryptoLists).map((key) => ({
          0: key,
          1: this.cryptoLists[key]
        }));

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCryptoList = this.cryptoLists.slice(startIndex, endIndex);
      } else {
        this.paginatedCryptoList = [];
      }
    } else {
      const result = this.cryptoLists.filter((crypto: { name: string }[]) =>
        crypto[1].name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      this.totalItems = result.length;

      this.currentPage = 1;

      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCryptoList = result.slice(startIndex, endIndex);

      this.cryptoIds = this.paginatedCryptoList.map((crypto) => crypto[1].id);

    }

    return of(this.cryptoIds);
  }


  // getTable(cryptoIds: number[] ) {
  //   const chunks = this.getArrayChunks(cryptoIds, 50);
  //   forkJoin(
  //     chunks.map((chunk) => this.fetchservice.getCryptoPriceDetails(chunk))
  //   ).subscribe(
  //     (data: any) => {
  //       const dataArray = Object.values(data);
  //       dataArray.forEach((response: any) => {
  //         const details = Object.values(response?.data) || [];
  //         details.forEach((crypto: any) => {
  //           if (crypto) {
  //             this.sparklineIn7dCryptoList.push(crypto.sparkline_in_7d);
  //           }
  //         });
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }
  

  cryptoDtlails(crypto: string, cryptoName: string) {
    const cryptoUpperCase = crypto.toUpperCase();
    this.titleService.setTitle(cryptoName + ' price today');
    this.router.navigate(['/wallet/coin-detail'], {
      queryParams: { crypto: cryptoUpperCase }
    });
  }


  getCryptoLabels(): string[] {
    return this.paginatedCryptoList.map((crypto) => crypto[0]);
  }
  
  getColor(variation: number) {
    return variation > 0 ? '#00CC9E' : '#F52079';
  }
  getNumberWithLeadingZeros(i: number): string {
    return String(i).padStart(2, '0');
  }
  clear() {
    this.searchQuery = '';
  }
  tofixUsd(price: any) {
    if (price < 0.1) {
      return '8';
    }
    if (price >= 0.1 && price <= 1.9) {
      return '6';
    }
    if (price >= 2 && price <= 9.9999) {
      return '5';
    }
    if (price >= 10.0 && price <= 9999.9) {
      return '2';
    }
    if (price >= 10000 && price <= 99999999999) {
      return '0';
    }

    return '0';
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage = pageNumber;
      this.filterCryptos();
    }
  }

  nextPage() {
    if (this.currentPageRangeEnd < this.totalPages()) {
      this.currentPageRangeStart = this.currentPageRangeEnd + 1;
      this.currentPageRangeEnd = Math.min(
        this.currentPageRangeEnd + this.maxButtonsPerPage,
        this.totalPages()
      );
    }
    this.currentPage++;
    this.filterCryptos();
  }
  
  prevPage() {
    if (this.currentPageRangeStart > 1) {
      this.currentPageRangeEnd = this.currentPageRangeStart - 1;
      this.currentPageRangeStart = Math.max(
        this.currentPageRangeStart - this.maxButtonsPerPage,
        1
      );
    }
    this.currentPage--;
    this.filterCryptos();
  }
  

  pageNumbers(): number[] {
    const pageRange = [];
    for (
      let i = this.currentPageRangeStart;
      i <= this.currentPageRangeEnd;
      i++
    ) {
      pageRange.push(i);
    }
    return pageRange;
  }
  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
