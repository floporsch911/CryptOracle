import React, { useEffect, useReducer, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import axios from 'axios';
import IntervalBouton from "./Widget/intervalBouton"
import SelectCrypto from './Widget/selectCrypto';

export const RealtimeChart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const socketRef = useRef();
  const firstCandleTime = useRef(null);
  const isLoadingData = useRef(false);
  const [interval, setInterval] = useState('1m');
  const [selectedSymbol, selectedSetSymbol] = useState('BTCUSDT');

  // Connexion au WebSocket Binance
  const connectionWebSocketData = () => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
    socketRef.current = socket;

    console.log(socket.readyState);

    socket.onopen = () => {
      console.log('✅ WebSocket connecté');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const kline = data.k;

      if (kline.x) {
        const candlestickData = {
          time: kline.t / 1000,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        };
        console.log('New candlestick data:', candlestickData);
        seriesRef.current.update(candlestickData);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const getAnteriorData = async (endTime) => {
    if (isLoadingData.current) return;
    isLoadingData.current = true;
    const endTimeDate = new Date(endTime * 1000);
    const startTime = new Date(endTimeDate.getTime() - 24 * 60 * 60 * 1000);
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&startTime=${startTime.getTime()}&endTime=${endTimeDate.getTime()}`
    );
    return response.data.map((item) => ({
      time: item[0] / 1000,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  }

  // Données initiales depuis l'API REST Binance
  const getInitialData = async () => {
    /*
    GET https://api.binance.com/api/v3/klines
  ?symbol=BTCUSDT
  &interval=1h
  &startTime=1714608000000
  &endTime=1714633200000 
  Pour récupérer les données de bougies de 1 heure pour une période spécifique.
     */
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=500`
    );
    return response.data.map((item) => ({
      time: item[0] / 1000,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  };

  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },

      },
      height: 200,
      width: chartContainerRef.current?.clientWidth || 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    seriesRef.current = series;

    const init = async () => {
      const data = await getInitialData();
      series.setData(data);
      chart.timeScale().setVisibleRange({
        from: data[20].time,
        to: data[Math.min(200, data.length - 1)].time,
      });
      connectionWebSocketData();

      firstCandleTime.current = data[0].time;

      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!range) return;

        const isAtStart = Math.floor(range.from) <= Math.floor(firstCandleTime.current);
        if (isAtStart) {
          console.log('➡️ L’utilisateur est revenu à la première bougie visible');
        } else {
          getAnteriorData(firstCandleTime.current)
            .then((newData) => {
              if (newData == undefined || newData.length === 0) {
                return;
              }

              const map = new Map();

              // Récupère les données existantes dans la série
              const existingData = seriesRef.current.data();

              [...existingData, ...newData].forEach((candle) => {
                if (!map.has(candle.time)) {
                  map.set(candle.time, candle);
                }
              });

              const combinedData = [...map.values()].sort((a, b) => a.time - b.time);
              // Met à jour la série avec toutes les bougies
              seriesRef.current.setData(combinedData);
              isLoadingData.current = false;
              // Met à jour la référence du premier timestamp
              firstCandleTime.current = newData[0].time;


            })
            .catch((error) => {
              isLoadingData.current = false;
              console.error('Erreur lors de la récupération des données antérieures:', error);
            });
        }
      });
    };

    init();

    const handleResize = () => {
      chart.applyOptions({ height: 200, width: chartContainerRef.current?.clientWidth || 500, });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [interval, selectedSymbol]);

  const goToRealtime = () => {
    chartRef.current?.timeScale().scrollToRealTime();
  };

  return (
    <div>
      <div ref={chartContainerRef} style={{ width: '100%', height: '200px' }} />
      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'start' }}>
        <SelectCrypto selectedSymbol={selectedSymbol} setSelectedSymbol={selectedSetSymbol} />
        <IntervalBouton interval={interval} setInterval={setInterval} />
        <button
          onClick={goToRealtime}
          style={{
            padding: '8px 24px',
            borderRadius: '8px',
            fontWeight: 500,
            backgroundColor: '#f0f3fa',
            cursor: 'pointer',
            border: 'none',
            fontSize: '16px',
          }}
        >
          Go to realtime
        </button>
      </div>
    </div>
  );
};

export default RealtimeChart;