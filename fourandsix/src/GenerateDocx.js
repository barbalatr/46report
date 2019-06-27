var fs = require("fs");
var docx = require("docx");

export function bodyToSections(body) {
  const result = [];

  result.push({
    header: "I - OBJETIVO",
    paragraphs: [
      "Visa o presente trabalho, conforme se depreende da requisição de exames elaborada pela Autoridade Policial, efetuar exames periciais objetivando a realização de Vistoria Veicular."
    ]
  });
  result.push({
    header: "II - DO VEÍCULO E DOS EXAMES",
    paragraphs: [
      "Nas condições em que foi apresentado à perícia" +
        (body.isLocalIC
          ? " na sede da Equipe de Perícias Criminalísticas de São Sebastião"
          : "") +
        ", foi examinado um veículo do tipo " +
        body.tipoVeiculo +
        ", da marca " +
        body.marcaVeiculo +
        ", modelo " +
        body.modeloVeiculo +
        ", da cor " +
        body.corVeiculo +
        ", de placas " +
        body.placa +
        ", e que quando da realização dos exames apresentava: "
    ]
      .concat(
        body.danosVeiculo.map(dano => {
          return (
            "Vestígios de" +
            (dano.amolgamentoVeiculo &&
            dano.atritamentoVeiculo &&
            dano.fraturaVeiculo
              ? " amolgamento, atritamento e fratura"
              : dano.amolgamentoVeiculo && dano.atritamentoVeiculo
              ? " amolgamento e atritamento"
              : dano.amolgamentoVeiculo && dano.fraturaVeiculo
              ? " amolgamento e fratura"
              : dano.atritamentoVeiculo && dano.fraturaVeiculo
              ? " atritamento e fratura"
              : dano.amolgamentoVeiculo
              ? " amolgamento"
              : dano.atritamentoVeiculo
              ? " atritamento"
              : dano.fraturaVeiculo
              ? " fratura"
              : "") +
            (dano.aspectoDano === "Recentes"
              ? " de aspecto(s) recente(s)"
              : " de aspecto(s) não recente(s)") +
            " localizados" +
            (dano.dianteiraVeiculo ? " na dianteira" : "") +
            (dano.traseiraVeiculo ? " na traseira" : "") +
            (dano.flancoEsquerdo ? " no flanco esquerdo" : "") +
            (dano.flancoDireito ? " no flanco direito" : "") +
            (dano.teto ? " no teto" : "") +
            " e orientados" +
            (dano.esquerdaParaDireita ? " da esqueda para a direita" : "") +
            (dano.direitaParaEsquerda ? " da direita para a esquerda" : "") +
            (dano.frenteParaTras ? " da frente para trás" : "") +
            (dano.trasParafrente ? " de trás para a frente" : "") +
            "."
          );
        })
      )
      .concat([
        body.isPneuOk
          ? "Todos os pneumáticos do veículo se encontravam em bom estado de conservação no momento da realização dos exames."
          : "Foi verificado que os pneumáticos do veículo se encontravam nas seguintes condições no momento da realização do exame:"
      ])
      .concat(
        body.isPneuOk !== true && body.tipoVeiculo === "automóvel"
          ? [
              "Pneumático dianteiro direito " + body.pneuDianteiroDireito + ".",
              "Pneumático dianteiro esquerdo " +
                body.pneuDianteiroEsquerdo +
                ".",
              "Pneumático traseiro direito " + body.pneuTraseiroDireito + ".",
              "Pneumático traseiro esquerdo " + body.pneuTraseiroEsquerdo + "."
            ]
          : []
      )
      .concat(
        body.isPneuOk !== true && body.tipoVeiculo === "motocicleta"
          ? [
              "Pneumático dianteiro " + body.pneuDianteiro + ".",
              "Pneumático traseiro " + body.pneuTraseiro + "."
            ]
          : []
      )
      .concat([
        "Através da realização de exame estático, foi verificado que seus sistemas de segurança para tráfego se encontravam nas seguintes condições:",
        "Freio dianteiro: " + body.freios + ". " + body.motivoFreio,
        "Direção: " + body.direcao + ". " + body.motivoDirecao,
        "Parte Elétrica: " +
          body.parteEletrica +
          (body.parteEletrica === "funcionando parcialmente"
            ? ". " + body.motivoParteEletrica
            : body.parteEletrica === "não foi possível verificar"
            ? " em razão da " + body.motivoParteEletrica + "."
            : ".")
      ])
  });
  result.push({
    header: "III - CONSIDERAÇÕES FINAIS",
    paragraphs: ["Era o que havia a relatar."]
  });
  return result;
}
export function generateDoc(body) {
  // Create document
  var doc = new docx.Document();
  var emptyBreak = new docx.Paragraph("");

  // Header
  doc.Header;
  doc.Header.createParagraph("SECRETARIA DA SEGURANÇA PÚBLICA").center();
  doc.Header.createParagraph(
    "SUPERINTENDÊNCIA DA POLÍCIA TÉCNICO-CIENTÍFICA"
  ).center();
  doc.Header.createParagraph("INSTITUTO DE CRIMINALÍSTICA").center();
  doc.Header.createParagraph("NÚCLEO DE SÃO JOSÉ DOS CAMPOS").center();
  doc.Header.createParagraph(
    "EQUIPE DE PERÍCIAS CRIMINALÍSTICAS DE SÃO SEBASTIÃO"
  ).center();
  //Footer
  doc.Footer;
  doc.Footer.createParagraph("Laudo Pericial nº " + body.requisicao).center();
  doc.Footer.createParagraph()
    .center()
    .addRun(new docx.TextRun("Página ").pageNumber())
    .addRun(new docx.TextRun(" de ").numberOfTotalPages());

  // Natureza
  doc.addParagraph(emptyBreak);
  const naturezaParagraph = new docx.Paragraph().center();
  const naturezaParagraphText = new docx.TextRun(
    "Natureza da Ocorrência: " + body.natureza
  )

    .size(24)
    .font("Spranq eco sans");
  naturezaParagraph.addRun(naturezaParagraphText);
  doc.addParagraph(naturezaParagraph);

  // Laudo Pericial
  doc.addParagraph(emptyBreak);
  const laudoPericial = new docx.Paragraph().center();
  const laudoPericialText = new docx.TextRun("LAUDO PERICIAL")
    .bold()
    .size(24)
    .font("Spranq eco sans");
  laudoPericial.addRun(laudoPericialText);
  doc.addParagraph(laudoPericial);

  // Cabeçalho
  const diaAtendimento = body.dataAtendimento.substring(8, 10);
  const mesAtendimentoNumero = body.dataAtendimento.substring(5, 7);
  const meses = {
    "01": "janeiro",
    "02": "fevereiro",
    "03": "março",
    "04": "abril",
    "05": "maio",
    "06": "junho",
    "07": "julho",
    "08": "agosto",
    "09": "setembro",
    "10": "outubro",
    "11": "novembro",
    "12": "dezembro"
  };
  const mesAtendimentoNome = meses[mesAtendimentoNumero];
  const anoAtendimento = body.dataAtendimento.substring(0, 4);

  doc.addParagraph(emptyBreak);

  var cabecalhoParagraph = new docx.Paragraph().justified();
  var textoCabecalho = new docx.TextRun(
    "Em " +
      diaAtendimento +
      " de " +
      mesAtendimentoNome +
      " de " +
      anoAtendimento +
      ", no Instituto de Criminalística da Superintendência da Polícia Técnico-Científica da Secretaria da Segurança Pública do Estado de São Paulo, em conformidade com o disposto no artigo 178 do Decreto Lei nº 3.689, de 3 de outubro de 1941, o Diretor deste Instituto, Dr. Maurício da Silva Lazzarin, designou o Perito Criminal Dr. Rodrigo Barbalat Viana para proceder aos exames periciais em face da requisição de exame expedida pela autoridade competente do(a) " +
      body.delegacia +
      "."
  )
    .size(24)
    .font("Spranq eco sans");
  // Add more text into the paragraph if you wish
  cabecalhoParagraph.addRun(textoCabecalho);
  doc.addParagraph(cabecalhoParagraph);

  //Generate Chapters
  const sections = bodyToSections(body);

  sections.forEach(({ header, paragraphs }) => {
    doc.addParagraph(emptyBreak);
    var heading = new docx.Paragraph();
    var headingText = new docx.TextRun(header)
      .bold()
      .size(24)
      .font("Spranq eco sans");
    heading.addRun(headingText);
    doc.addParagraph(heading);
    doc.addParagraph(emptyBreak);

    paragraphs.forEach(paragraph => {
      var docParagraph = new docx.Paragraph().justified();
      var text = new docx.TextRun(paragraph).size(24).font("Spranq eco sans");
      docParagraph.addRun(text);
      doc.addParagraph(docParagraph);
    });
  });

  //Disclaimer
  doc.addParagraph(emptyBreak);
  var disclaimerParagraph = new docx.Paragraph().justified();
  const disclaimerText = new docx.TextRun(
    "O laudo original foi assinado digitalmente nos termos da M.P. 2200-2/2001 de 24/08/2001 e encontra-se arquivado eletronicamente nas bases do Sistema Gestor de Laudos (GDL) da Superintendência da Polícia Técnico-Científica do Estado de São Paulo."
  )
    .size(20)
    .font("Spranq eco sans");
  disclaimerParagraph.addRun(disclaimerText);
  doc.addParagraph(disclaimerParagraph);

  //Data Assinatura
  doc.addParagraph(emptyBreak);
  var dataAssinatura = new docx.Paragraph().right();
  const dataAssinaturaText = new docx.TextRun(
    "São Sebastião, " +
      diaAtendimento +
      " de " +
      mesAtendimentoNome +
      " de " +
      anoAtendimento +
      "."
  )
    .size(24)
    .font("Spranq eco sans");
  dataAssinatura.addRun(dataAssinaturaText);
  doc.addParagraph(dataAssinatura);

  // Id Perito
  doc.addParagraph(emptyBreak);
  var idPeritoParagraph = new docx.Paragraph().center();
  const IdPeritoText = new docx.TextRun("RODRIGO BARBALAT VIANA")
    .size(24)
    .font("Spranq eco sans");
  const peritoCriminal = new docx.TextRun("PERITO CRIMINAL")
    .size(24)
    .font("Spranq eco sans")
    .break();
  idPeritoParagraph.addRun(IdPeritoText);
  idPeritoParagraph.addRun(peritoCriminal);

  doc.addParagraph(idPeritoParagraph);

  // Used to export the file into a .docx file
  const nomeArquivo = "Laudo - Req. " + body.requisicao + ".docx";
  var packer = new docx.Packer();
  packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(nomeArquivo, buffer);
  });
}
