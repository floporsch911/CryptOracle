import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import axios from 'axios';
import IntervalBouton from "./Widget/intervalBouton"
import SelectCrypto from './Widget/selectCrypto';
import PropTypes from 'prop-types';
import "./financialChart.css"

export default function FinancialChart({ selectedSymbol, setSelectedSymbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const socketRef = useRef();
  const firstCandleTime = useRef(null);
  const isLoadingData = useRef(false);
  const [interval, setInterval] = useState('1m');

  FinancialChart.propTypes = {
    selectedSymbol: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      // ajoutez d'autres propriétés si besoin
    }).isRequired,
    setSelectedSymbol: PropTypes.func.isRequired,
  };

  // Connexion au WebSocket Binance
  const isClosing = useRef(false);

  const connectionWebSocketData = () => {
    if (socketRef.current && !isClosing.current) {
      isClosing.current = true;
      socketRef.current.onclose = () => {
        isClosing.current = false;
        openNewWebSocket();
      };
      socketRef.current.close();
    } else if (!socketRef.current) {
      openNewWebSocket();
    }
  };

  const openNewWebSocket = () => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${selectedSymbol.symbol.toLowerCase()}@kline_${interval}`;
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
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
        seriesRef.current.update(candlestickData);
      }
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
      `/api/get/crypto/data?symbol=${selectedSymbol.symbol}&interval=${interval}&startTime=${startTime.getTime()}&endTime=${endTimeDate.getTime()}`
    );
    return response.data.data
  }

  // Données initiales depuis l'API REST Binance
  const getInitialData = async () => {
    const response = await axios.get(
      `/api/get/crypto/data?symbol=${selectedSymbol.symbol}&interval=${interval}`
    );
    return response.data.data
  };

  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },

      },
      height: 400,
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
      connectionWebSocketData();
      chart.timeScale().setVisibleRange({
        from: data[20].time,
        to: data[Math.min(200, data.length - 1)].time,
      });


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
      chart.applyOptions({ height: 400, width: chartContainerRef.current?.clientWidth || 500, });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null; // évite boucle au démontage
        socketRef.current.close();
        socketRef.current = null;
      }
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [interval, selectedSymbol]);

  const goToRealtime = () => {
    chartRef.current?.timeScale().scrollToRealTime();
  };
  return (
    <div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center", // aligne les éléments verticalement
        gap: "8px",           // petit espacement si jamais il y a wrap
        overflow: "hidden"
      }}>
        <IntervalBouton interval={interval} setInterval={setInterval} />
        <SelectCrypto selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height: 'auto' }} />
      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'start' }}>
        <button
          onClick={goToRealtime}
          className='btn-go-real-time'
        >
          Go to realtime
        </button>
      </div>
    </div>
  );
};