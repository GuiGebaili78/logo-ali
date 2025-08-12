"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { validateCep, formatCep } from "@/utils/validators";
import { SAMPLE_STREETS } from "@/utils/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ServiceSelector from "./ServiceSelector";

export default function SearchBar() {
  const { performSearch, isLoading } = useAppContext();
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [cep, setCep] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showStreetNumber, setShowStreetNumber] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Close autocomplete when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStreetChange = (value: string) => {
    setStreet(value);
    setCep(""); // Clear CEP when street is used
    setValidationMessage("");

    if (value.length >= 2) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
      setShowStreetNumber(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setStreet(""); // Clear street when CEP is used
    setShowStreetNumber(false);
    setShowAutocomplete(false);
    setValidationMessage("");

    if (formatted.length === 9) {
      if (validateCep(formatted)) {
        setValidationMessage("✓ CEP válido");
        setMessageType("success");
      } else {
        setValidationMessage("✗ CEP inválido");
        setMessageType("error");
      }
    }
  };

  const selectStreet = (selectedStreet: string) => {
    setStreet(selectedStreet);
    setShowAutocomplete(false);
    setShowStreetNumber(true);
  };

  const filteredStreets = SAMPLE_STREETS.filter((s) =>
    s.toLowerCase().includes(street.toLowerCase())
  );

  const handleSearch = () => {
    setValidationMessage("");

    // Validation
    if (!street && !cep) {
      setValidationMessage("Por favor, informe um endereço (rua ou CEP)");
      setMessageType("error");
      return;
    }

    if (street && !streetNumber) {
      setValidationMessage("Por favor, informe o número do endereço");
      setMessageType("error");
      return;
    }

    if (cep && !validateCep(cep)) {
      setValidationMessage("Por favor, informe um CEP válido");
      setMessageType("error");
      return;
    }

    // Perform search
    performSearch({
      street,
      streetNumber,
      cep,
      serviceType: selectedService,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Street Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Nome da Rua
          </label>
          <div className="relative" ref={autocompleteRef}>
            <Input
              type="text"
              placeholder="Ex: Rua Augusta"
              value={street}
              onChange={(e) => handleStreetChange(e.target.value)}
            />

            {/* Autocomplete */}
            {showAutocomplete && filteredStreets.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 autocomplete-list z-10">
                {filteredStreets.map((streetName, index) => (
                  <div
                    key={index}
                    className="autocomplete-item px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition-colors"
                    onClick={() => selectStreet(streetName)}
                  >
                    {streetName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Street Number */}
          {showStreetNumber && (
            <Input
              type="text"
              placeholder="Número"
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {/* CEP Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">CEP</label>
          <Input
            type="text"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
          />
        </div>

        {/* Service Selector */}
        <ServiceSelector
          value={selectedService}
          onChange={setSelectedService}
        />

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={handleSearch} loading={isLoading} className="w-full">
            Buscar Serviços
          </Button>
        </div>
      </div>

      {/* Validation Messages */}
      {validationMessage && (
        <div className="mt-4">
          <div
            className={`border rounded-lg p-4 ${
              messageType === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <p className="text-sm font-medium">{validationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
