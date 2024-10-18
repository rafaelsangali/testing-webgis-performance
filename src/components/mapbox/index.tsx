/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl'; // Mapbox GL JS
import MapboxDraw from '@mapbox/mapbox-gl-draw'; // Mapbox Draw
import 'mapbox-gl/dist/mapbox-gl.css'; // Estilos do Mapbox GL JS
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'; // Estilos do Mapbox Draw
import * as turf from '@turf/turf'
import toast from 'react-hot-toast';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_TOKEN as string;

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cria o mapa do Mapbox
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Estilo do mapa
      center: [0, 0], // Centro do mapa
      zoom: 1, // Nível de zoom inicial
    });

    mapRef.current = map;

    // Cria a instância do Mapbox Draw com controles básicos
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        trash: true, // Botão para excluir
        line_string: true, // Ferramenta para desenhar linhas
        point: true, // Ferramenta para desenhar pontos
        polygon: true, // Ferramenta para desenhar polígonos
      },
    });

    drawRef.current = draw;

    // Adiciona o controle de desenho ao mapa
    map.addControl(draw);

    // Função para lidar com o arquivo arrastado e solto
    const handleDrop = (event: DragEvent) => {
      toast.loading('Calma ai que ta carregando')
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];

        if (file.type === 'application/geo+json' || file.name.endsWith('.geojson')) {
          const reader = new FileReader();

          reader.onload = function (e) {
            if (e.target?.result) {
              try {
                const geojson = JSON.parse(e.target.result as string);

                // Adiciona o GeoJSON ao controle de desenho
                console.log(geojson)
                draw.deleteAll()
                draw.add(geojson);
                toast.dismiss()
                toast('O arquivo foi lido')

                // Calcula o bounding box do GeoJSON e ajusta o zoom do mapa para caber na tela
                const bbox = turf.bbox(geojson) as any;
                map.fitBounds(bbox, { padding: 20 }); // Ajusta o mapa para caber os dados
              } catch (error) {
                toast.dismiss()
                toast.error('Deu ruim com esse arquivo, me chama')
                console.error('Erro ao carregar o arquivo GeoJSON:', error);
              }
            }
          };

          reader.readAsText(file);
        } else {
          console.error('Por favor, carregue um arquivo .geojson válido');
        }
      }
    };

    // Previne comportamentos padrões de arrastar/soltar
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    // Adiciona os listeners de drag e drop
    if (mapContainerRef.current) {
      mapContainerRef.current.addEventListener('drop', handleDrop);
      mapContainerRef.current.addEventListener('dragover', handleDragOver);
    }

    return () => {
      if (mapRef.current) {
        if (drawRef.current) {
          mapRef.current.removeControl(drawRef.current); // Remove o controle ao desmontar
        }
        mapRef.current.remove(); // Remove o mapa
      }

      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('drop', handleDrop);
        mapContainerRef.current.removeEventListener('dragover', handleDragOver);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100vh', width: '100%' }}
      onDrop={(e) => e.preventDefault()} // Evita comportamentos padrão de drop
      onDragOver={(e) => e.preventDefault()} // Evita comportamentos padrão de drag
    />
  );
};

export default MapComponent;
