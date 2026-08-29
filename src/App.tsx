import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { GradeIndicacoesView } from './components/grade/GradeIndicacoesView';
import { IndicadosView } from './components/indicados/IndicadosView';
import { LocaisView } from './components/locais/LocaisView';
import { MapaBairrosView } from './components/mapa/MapaBairrosView';
import { SqlView } from './components/sql/SqlView';

// Modais
import { FichaIndicadoModal } from './components/modals/FichaIndicadoModal';
import { NovaIndicacaoModal } from './components/modals/NovaIndicacaoModal';
import { IndicadoModal } from './components/modals/IndicadoModal';
import { LocalTrabalhoModal } from './components/modals/LocalTrabalhoModal';

import { DataService, subscribeToDataChanges } from './services/dataService';
import { ExportService } from './services/exportService';
import {
  Indicado,
  LocalTrabalho,
  GradeIndicacao,
  IndicacaoEnriquecida
} from './types';

export const App: React.FC = () => {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipoGlobal, setFiltroTipoGlobal] = useState<string>('ALL');

  // Modais State
  const [isFichaOpen, setIsFichaOpen] = useState(false);
  const [selectedIndicadoParaFicha, setSelectedIndicadoParaFicha] = useState<Indicado | undefined>();
  const [selectedIndicacaoParaFicha, setSelectedIndicacaoParaFicha] = useState<IndicacaoEnriquecida | undefined>();

  const [isNovaIndicacaoOpen, setIsNovaIndicacaoOpen] = useState(false);
  const [indicacaoToEdit, setIndicacaoToEdit] = useState<GradeIndicacao | undefined>();
  const [preSelectedIndicadoId, setPreSelectedIndicadoId] = useState<string | undefined>();

  const [isIndicadoModalOpen, setIsIndicadoModalOpen] = useState(false);
  const [indicadoToEdit, setIndicadoToEdit] = useState<Indicado | undefined>();

  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const [localToEdit, setLocalToEdit] = useState<LocalTrabalho | undefined>();

  // Inscrição reativa para alterações no localStorage
  useEffect(() => {
    const unsubscribe = subscribeToDataChanges(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  // Dados carregados do DataService
  const indicados = DataService.getIndicados();
  const locais = DataService.getLocaisTrabalho();
  const grade = DataService.getGradeEnriquecida();
  const metrics = DataService.getDashboardMetrics();

  // Handlers para Modais e Ações
  const handleOpenFichaIndicado = (indicadoId: string) => {
    const ind = indicados.find(i => i.id === indicadoId);
    const indVinc = grade.find(g => g.indicado_id === indicadoId && g.status === 'Ativo') || grade.find(g => g.indicado_id === indicadoId);
    if (ind) {
      setSelectedIndicadoParaFicha(ind);
      setSelectedIndicacaoParaFicha(indVinc);
      setIsFichaOpen(true);
    }
  };

  const handleOpenNovaIndicacao = (indicadoId?: string) => {
    setIndicacaoToEdit(undefined);
    setPreSelectedIndicadoId(indicadoId);
    setIsNovaIndicacaoOpen(true);
  };

  const handleOpenEditarIndicacao = (indicacaoId: string) => {
    const item = grade.find(g => g.id === indicacaoId);
    if (item) {
      setIndicacaoToEdit(item);
      setPreSelectedIndicadoId(item.indicado_id);
      setIsNovaIndicacaoOpen(true);
    }
  };

  const handleOpenNovoIndicado = () => {
    setIndicadoToEdit(undefined);
    setIsIndicadoModalOpen(true);
  };

  const handleOpenEditarIndicado = (indicadoId: string) => {
    const ind = indicados.find(i => i.id === indicadoId);
    if (ind) {
      setIndicadoToEdit(ind);
      setIsIndicadoModalOpen(true);
    }
  };

  const handleOpenNovoLocal = () => {
    setLocalToEdit(undefined);
    setIsLocalModalOpen(true);
  };

  const handleOpenEditarLocal = (localId: string) => {
    const loc = locais.find(l => l.id === localId);
    if (loc) {
      setLocalToEdit(loc);
      setIsLocalModalOpen(true);
    }
  };

  const handleDesligarIndicacao = (indicacaoId: string) => {
    DataService.updateGradeIndicacao(indicacaoId, {
      status: 'Desligado',
      data_desligamento: new Date().toISOString().split('T')[0]
    });
  };

  const handleExportPDF = () => {
    ExportService.exportarGradePDF(grade, 'Gabinete do Mandato • Fortaleza / CE');
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar os dados de demonstração de indicados de Fortaleza e empresas terceirizadas?')) {
      DataService.resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Topbar / Navbar */}
      <Navbar
        filtroTipo={filtroTipoGlobal}
        onSelectFiltroTipo={setFiltroTipoGlobal}
        onOpenNovaIndicacao={() => handleOpenNovaIndicacao()}
        onOpenNovoIndicado={handleOpenNovoIndicado}
        onOpenNovoLocal={handleOpenNovoLocal}
        onExportPDF={handleExportPDF}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Layout Principal com Sidebar e Conteúdo Dinâmico */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          metrics={metrics}
          onResetData={handleResetData}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              onOpenNovaIndicacao={() => handleOpenNovaIndicacao()}
              onNavigateToGrade={() => setActiveTab('grade')}
              onNavigateToMapa={() => setActiveTab('mapa')}
              onNavigateToTerceirizadas={() => {
                setFiltroTipoGlobal('Empresa Terceirizada');
                setActiveTab('locais');
              }}
              onOpenFichaIndicado={handleOpenFichaIndicado}
            />
          )}

          {activeTab === 'grade' && (
            <GradeIndicacoesView
              indicacoes={grade}
              locais={locais}
              filtroTipo={filtroTipoGlobal}
              onSelectFiltroTipo={setFiltroTipoGlobal}
              onOpenNovaIndicacao={() => handleOpenNovaIndicacao()}
              onOpenEditarIndicacao={handleOpenEditarIndicacao}
              onOpenFichaIndicado={handleOpenFichaIndicado}
              onDesligarIndicacao={handleDesligarIndicacao}
              onDeleteIndicacao={(id) => DataService.deleteGradeIndicacao(id)}
            />
          )}

          {activeTab === 'indicados' && (
            <IndicadosView
              indicados={indicados}
              grade={grade}
              onOpenNovoIndicado={handleOpenNovoIndicado}
              onOpenEditarIndicado={handleOpenEditarIndicado}
              onOpenFichaIndicado={handleOpenFichaIndicado}
              onDeleteIndicado={(id) => DataService.deleteIndicado(id)}
              onOpenNovaIndicacaoParaIndicado={(id) => handleOpenNovaIndicacao(id)}
            />
          )}

          {activeTab === 'locais' && (
            <LocaisView
              locais={locais}
              grade={grade}
              onOpenNovoLocal={handleOpenNovoLocal}
              onOpenEditarLocal={handleOpenEditarLocal}
              onDeleteLocal={(id) => DataService.deleteLocalTrabalho(id)}
            />
          )}

          {activeTab === 'mapa' && (
            <MapaBairrosView
              indicados={indicados}
              grade={grade}
              onOpenFichaIndicado={handleOpenFichaIndicado}
              onOpenNovaIndicacaoParaIndicado={(id) => handleOpenNovaIndicacao(id)}
            />
          )}

          {activeTab === 'sql' && <SqlView />}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAIS GLOBAIS DE GABINETE */}
      {/* ========================================================================= */}
      {/* 1. Ficha Completa em 1 Clique */}
      <FichaIndicadoModal
        isOpen={isFichaOpen}
        onClose={() => setIsFichaOpen(false)}
        indicado={selectedIndicadoParaFicha}
        indicacaoAtual={selectedIndicacaoParaFicha}
        onEditIndicado={(id) => {
          setIsFichaOpen(false);
          handleOpenEditarIndicado(id);
        }}
      />

      {/* 2. Lançar/Editar Indicação */}
      <NovaIndicacaoModal
        isOpen={isNovaIndicacaoOpen}
        onClose={() => setIsNovaIndicacaoOpen(false)}
        indicados={indicados}
        locais={locais}
        indicacaoToEdit={indicacaoToEdit}
        initialIndicadoId={preSelectedIndicadoId}
        onSaveIndicacao={(data, id) => {
          if (id) {
            DataService.updateGradeIndicacao(id, data);
          } else {
            DataService.createGradeIndicacao(data);
          }
        }}
        onOpenNovoIndicado={() => {
          setIsNovaIndicacaoOpen(false);
          setIsIndicadoModalOpen(true);
        }}
        onOpenNovoLocal={() => {
          setIsNovaIndicacaoOpen(false);
          setIsLocalModalOpen(true);
        }}
      />

      {/* 3. Cadastrar/Editar Pessoa */}
      <IndicadoModal
        isOpen={isIndicadoModalOpen}
        onClose={() => setIsIndicadoModalOpen(false)}
        indicadoToEdit={indicadoToEdit}
        onSaveIndicado={(data, id) => {
          if (id) {
            DataService.updateIndicado(id, data);
          } else {
            DataService.createIndicado(data);
          }
        }}
      />

      {/* 4. Cadastrar/Editar Local ou Empresa Terceirizada */}
      <LocalTrabalhoModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        localToEdit={localToEdit}
        onSaveLocal={(data, id) => {
          if (id) {
            DataService.updateLocalTrabalho(id, data);
          } else {
            DataService.createLocalTrabalho(data);
          }
        }}
      />
    </div>
  );
};
