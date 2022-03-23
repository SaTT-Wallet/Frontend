function tradingView() {
  new TradingView.widget({
    width: 980,
    height: 610,
    symbol: 'BTC:USDT',
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: 'light',
    style: '1',
    locale: 'en',
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: 'tradingview_5f249'
  });
}
