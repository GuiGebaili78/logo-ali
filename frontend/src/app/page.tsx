"use client";

import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/search/SearchBar";
import ServiceSelector from "../components/search/ServiceSelector";
import ServiceList from "../components/services/ServicesList";
import MapView from "../components/map/MapView";
import { AppProvider } from "../context/AppContext";

export default function HomePage() {
  return (
    <AppProvider>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary-color)] mb-6">
              Serviços Públicos de São Paulo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Encontre serviços públicos próximos ao seu endereço: coleta de
              lixo, cata-bagulho, saúde, vacinação, bem-estar animal e muito
              mais.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Search Section */}
            <div className="space-y-6">
              <SearchBar />
              <ServiceList services={[]} />
            </div>

            {/* Map Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <MapView
                center={null}
                services={[]}
                onServiceSelect={function (serviceId: number): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    </AppProvider>
  );
}
