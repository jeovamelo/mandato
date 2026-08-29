import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { IndicacaoEnriquecida, Indicado } from '../types';

export class ExportService {
  /**
   * Exporta a Grade Completa de Indicações em PDF Oficial de Gabinete
   */
  static exportarGradePDF(indicacoes: IndicacaoEnriquecida[], tituloGabinete = 'Gabinete Parlamentar - Fortaleza / CE'): void {
    const doc = new jsPDF('landscape', 'pt', 'a4');

    // Cabeçalho
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 842, 65, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MANDATOGOV • RELATÓRIO DE CONTROLE DE INDICAÇÕES DE GABINETE', 40, 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`${tituloGabinete} • Mapeamento de Pessoas, Bairros e Terceirizadas • Emitido em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 40, 48);

    // Tabela
    const headers = [
      ['Nome do Indicado', 'CPF / Contato', 'Bairro / Moradia', 'Local de Trabalho / Terceirizada', 'Tipo', 'Cargo / Função', 'Status', 'Data Indicação']
    ];

    const data = indicacoes.map((item) => [
      item.indicado.nome_completo,
      `${item.indicado.cpf}\n${item.indicado.telefone}`,
      `${item.indicado.bairro_residencia}\n${item.indicado.endereco_residencial}`,
      `${item.local.sigla_ou_apelido || item.local.nome_empresa_ou_orgao}\n${item.local.endereco_trabalho}`,
      item.local.tipo_instituicao === 'Empresa Terceirizada' ? 'Terceirizada' : 'Órgão Direto',
      item.cargo_ou_funcao,
      item.status,
      new Date(item.data_indicacao).toLocaleDateString('pt-BR')
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 80,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 4,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 40, right: 40 }
    });

    doc.save(`grade-indicacoes-gabinete-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Exporta a Grade de Indicações em Planilha Excel (XLSX)
   */
  static exportarGradeExcel(indicacoes: IndicacaoEnriquecida[]): void {
    const rows = indicacoes.map((item) => ({
      'Nome Completo': item.indicado.nome_completo,
      'CPF': item.indicado.cpf,
      'RG': item.indicado.rg || '',
      'Telefone': item.indicado.telefone,
      'E-mail': item.indicado.email || '',
      'Bairro de Residência': item.indicado.bairro_residencia,
      'Endereço Residencial': item.indicado.endereco_residencial,
      'Liderança de Referência': item.indicado.lideranca_responsavel || '',
      'Local / Empresa': item.local.nome_empresa_ou_orgao,
      'Sigla / Apelido': item.local.sigla_ou_apelido || '',
      'Tipo de Instituição': item.local.tipo_instituicao,
      'Endereço do Trabalho': item.local.endereco_trabalho,
      'Esfera': item.local.esfera,
      'Cargo / Função': item.cargo_ou_funcao,
      'Remuneração (R$)': item.remuneracao_estimada || 0,
      'Status': item.status,
      'Data da Indicação': item.data_indicacao,
      'Observações': item.observacoes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grade de Indicações');

    XLSX.writeFile(workbook, `grade-indicacoes-gabinete-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  /**
   * Exporta o Banco de Pessoas/Lideranças em Excel
   */
  static exportarIndicadosExcel(indicados: Indicado[]): void {
    const rows = indicados.map((item) => ({
      'Nome Completo': item.nome_completo,
      'CPF': item.cpf,
      'RG': item.rg || '',
      'Telefone': item.telefone,
      'E-mail': item.email || '',
      'Bairro': item.bairro_residencia,
      'Endereço Residencial': item.endereco_residencial,
      'Cidade': item.cidade,
      'UF': item.uf,
      'Liderança Responsável': item.lideranca_responsavel || '',
      'Observações': item.observacoes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Banco de Indicados');

    XLSX.writeFile(workbook, `indicados-gabinete-${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}
