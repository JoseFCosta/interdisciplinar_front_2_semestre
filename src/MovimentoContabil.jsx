import React, { useState, useEffect } from "react";
import {
  cadastrarMovimentoContabil,
  visualizarMovimentoContabil,
  atualizarMovimentoContabil,
  deletarMovimentoContabil,
} from "./components/MovimentoContabilService";
import { visualizarPlanoContas } from "./components/planoContasService";
import { visualizarItemOrdemComprar } from "./components/ITEM_ORDEM_DE_COMPRARService";
import { visualizarItensVenda } from "./components/Itens_da_VendaService";
import { visualizarEscrituraFiscal } from "./components/EscrituraFiscalService";

import { Button, Modal, Form } from "react-bootstrap";

const MovimentoContabil = () => {
  const [movimentos, setMovimentos] = useState([]);
  const [dados, setDados] = useState({
    idMovimentoContabil: "",
    NumeroLancamento: "",
    Data: "",
    VerificacaoFinanceiro: "",
    VerificacaoContabil: "",
    idPlanoContas: "",
    IdEscrituraFiscal: "",
    id_Vendas: "",
    id_item_ordem_comp: "",
    ValorDebito: "",
    ValorCredito: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchError, setFetchError] = useState(false);

//PLANO CONTAS ID

  // Estado para Plano de Contas
  const [planosDeContas, setPlanosDeContas] = useState([]);
  const [selectedPlanoDeContas, setSelectedPlanoDeContas] = useState('');

  // Estado para Escritura Fiscal
  const [escrituras, setEscrituras] = useState([]);
  const [selectedEscritura, setSelectedEscritura] = useState('');

  // Estado para Itens da Venda
  const [itensVenda, setItensVenda] = useState([]);
  const [selectedItemVenda, setSelectedItemVenda] = useState('');

  // Estado para Itens da Ordem de Compra
  const [itensOrdem, setItensOrdem] = useState([]);
  const [selectedItemOrdem, setSelectedItemOrdem] = useState('');

  // useEffect para buscar dados dos planos de contas
  useEffect(() => {
    const fetchPlanosDeContas = async () => {
      try {
        const planos = await visualizarPlanoContas();
        setPlanosDeContas(planos);
      } catch (error) {
        console.error('Erro ao buscar planos de contas:', error);
      }
    };

    fetchPlanosDeContas();
  }, []);

  // useEffect para buscar dados das escrituras fiscais
  useEffect(() => {
    const fetchEscrituras = async () => {
      try {
        const escrits = await visualizarEscrituraFiscal();
        setEscrituras(escrits);
      } catch (error) {
        console.error('Erro ao buscar escrituras fiscais:', error);
      }
    };

    fetchEscrituras();
  }, []);

  // useEffect para buscar dados dos itens de venda
  useEffect(() => {
    const fetchItensVenda = async () => {
      try {
        const itens = await visualizarItensVenda();
        setItensVenda(itens);
      } catch (error) {
        console.error('Erro ao buscar itens de venda:', error);
      }
    };

    fetchItensVenda();
  }, []);

  // useEffect para buscar dados dos itens da ordem de compra
  useEffect(() => {
    const fetchItensOrdem = async () => {
      try {
        const itens = await visualizarItemOrdemComprar();
        setItensOrdem(itens);
      } catch (error) {
        console.error('Erro ao buscar itens da ordem de compra:', error);
      }
    };

    fetchItensOrdem();
  }, []);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await visualizarMovimentoContabil();
        setMovimentos(data);
      } catch (error) {
        setFetchError(true);
      }
    };
    fetchData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      NumeroLancamento: dados.NumeroLancamento,
      Data: dados.Data,
      VerificacaoFinanceiro: dados.VerificacaoFinanceiro,
      VerificacaoContabil: dados.VerificacaoContabil,
      idPlanoContas: dados.idPlanoContas,
      IdEscrituraFiscal: dados.IdEscrituraFiscal,
      id_Vendas: dados.id_Vendas,
      id_item_ordem_comp: dados.id_item_ordem_comp,
      ValorDebito: dados.ValorDebito,
      ValorCredito: dados.ValorCredito,
    });
    try {
      if (isEditing) {
        await atualizarMovimentoContabil(dados.idMovimentoContabil, {
          NumeroLancamento: dados.NumeroLancamento,
          Data: dados.Data,
          VerificacaoFinanceiro: dados.VerificacaoFinanceiro,
          VerificacaoContabil: dados.VerificacaoContabil,
          idPlanoContas: dados.idPlanoContas,
          IdEscrituraFiscal: dados.IdEscrituraFiscal,
          id_Vendas: dados.id_Vendas,
          id_item_ordem_comp: dados.id_item_ordem_comp,
          ValorDebito: dados.ValorDebito,
          ValorCredito: dados.ValorCredito,
        });
      } else {
        await cadastrarMovimentoContabil({
          NumeroLancamento: dados.NumeroLancamento,
          Data: dados.Data,
          VerificacaoFinanceiro: dados.VerificacaoFinanceiro,
          VerificacaoContabil: dados.VerificacaoContabil,
          idPlanoContas: dados.idPlanoContas,
          IdEscrituraFiscal: dados.IdEscrituraFiscal,
          id_Vendas: dados.id_Vendas,
          id_item_ordem_comp: dados.id_item_ordem_comp,
          ValorDebito: dados.ValorDebito,
          ValorCredito: dados.ValorCredito,
        });
      }
      const data = await visualizarMovimentoContabil();
      setMovimentos(data);
      setDados({
        idMovimentoContabil: "",
        NumeroLancamento: "",
        Data: "",
        VerificacaoFinanceiro: "",
        VerificacaoContabil: "",
        idPlanoContas: "",
        IdEscrituraFiscal: "",
        id_Vendas: "",
        id_item_ordem_comp: "",
        ValorDebito: "",
        ValorCredito: "",
      });
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Erro ao salvar os dados."
      );
      setShowErrorModal(true);
    }
  };

  const handleEdit = (plano) => {
    setDados(plano);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (idMovimentoContabil) => {
    console.log(idMovimentoContabil)
    try {
      await deletarMovimentoContabil(idMovimentoContabil);
      const data = await visualizarMovimentoContabil();
      setMovimentos(data);
    } catch (error) {
    
        setErrorMessage("Erro ao deletar o plano de contas.");
      
      setShowErrorModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setDados({
      idMovimentoContabil: "",
      NumeroLancamento: "",
      Data: "",
      VerificacaoFinanceiro: "",
      VerificacaoContabil: "",
      idPlanoContas: "",
      IdEscrituraFiscal: "",
      id_Vendas: "",
      id_item_ordem_comp: "",
      ValorDebito: "",
      ValorCredito: "",
    });
  };

  const handleErrorModalClose = () => setShowErrorModal(false);

  if (fetchError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Não foi possível acessar o banco de dados.
        </div>
        <Button variant="primary" >
          Ir para a página inicial
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>MOVIMENTO CONTABIL</h1>
      <br/>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Cadastrar Novo Plano
      </Button>
      <br/>
      <ul className="list-group mt-4">
        {movimentos.map((plano) => (
          <li
            key={plano.idMovimentoContabil}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {plano.idMovimentoContabil} // {plano.NumeroLancamento} -{" "}
            {plano.Data} -{plano.VerificacaoFinanceiro} -{" "}
            {plano.VerificacaoContabil}
            <div>
              <Button
                variant="warning"
                className="mr-2"
                onClick={() => handleEdit(plano)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(plano.idMovimentoContabil)}
              >
                Deletar
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing
              ? "Atualizar Movimento Contabil"
              : "Cadastrar Movimento Contabil"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNumeroLancamento">
              <Form.Label>Número Lançamento</Form.Label>
              <Form.Control
                type="text"
                value={dados.NumeroLancamento}
                onChange={(e) =>
                  setDados({ ...dados, NumeroLancamento: e.target.value })
                }
                placeholder="Digite o número do lançamento"
              />
            </Form.Group>
            <Form.Group controlId="formData">
              <Form.Label>Data de Lançamento</Form.Label>
              <Form.Control
                type="date"
                value={dados.Data}
                onChange={(e) => setDados({ ...dados, Data: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formVerificacaoFinanceiro">
              <Form.Label>Verificação Financeira</Form.Label>
              <Form.Control
                as="select"
                value={dados.VerificacaoFinanceiro}
                onChange={(e) =>
                  setDados({ ...dados, VerificacaoFinanceiro: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="aprovado">Aprovado</option>
                <option value="negado">Negado</option>
                <option value="indefinido">Indefinido</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formVerificacaoContabil">
              <Form.Label>Verificação Contábil</Form.Label>
              <Form.Control
                as="select"
                value={dados.VerificacaoContabil}
                onChange={(e) =>
                  setDados({ ...dados, VerificacaoContabil: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="aprovado">Aprovado</option>
                <option value="negado">Negado</option>
                <option value="indefinido">Indefinido</option>
              </Form.Control>
            </Form.Group>

         
          <Form.Group controlId="formIdPlanoContas">
              <Form.Label>ID Plano de Contas</Form.Label>
              <Form.Control
                as="select"
                value={dados.idPlanoContas}
                onChange={(e) =>
                  setDados({ ...dados, idPlanoContas: e.target.value })
                }
              >
                <option value="">Selecione selecione uma das opções</option>
                {planosDeContas.map((plano) => (
                  <option key={plano.idPlanoContas} value={plano.idPlanoContas}>
                    {plano.CodigoPlano}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
{/******************************** */}
            <Form.Group controlId="formIdEscrituraFiscal">
              <Form.Label>ID Escritura Fiscal</Form.Label>
              <Form.Control
                as="select"
                value={dados.IdEscrituraFiscal}
                onChange={(e) =>
                  setDados({ ...dados, IdEscrituraFiscal: e.target.value })
                }
              >
                <option value="">Selecione selecione uma das opções</option>
                {escrituras.map((plano) => (
                  <option key={plano.IdEscrituraFiscal} value={plano.IdEscrituraFiscal}>
                   Id: {plano.IdEscrituraFiscal} - Descrição: {plano.Descricao}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            
{/******************************** */}
{/******************************** */}
            <Form.Group controlId="formIdVendas">
              <Form.Label>ID Vendas</Form.Label>
              <Form.Control
                as="select"
                value={dados.id_Vendas}
                onChange={(e) =>
                  setDados({ ...dados, id_Vendas: e.target.value })
                }
              >
                <option value="">Selecione selecione uma das opções</option>
                {itensVenda.map((plano) => (
                  <option key={plano.id_Vendas} value={plano.id_Vendas}>
                   Codigo do Especialista: {plano.cod_espec} - Valor: {plano.Valor}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            
            <Form.Group controlId="formIdVendas">
              <Form.Label>ID Item Ordem Compra</Form.Label>
              <Form.Control
                as="select"
                value={dados.id_item_ordem_comp}
                onChange={(e) =>
                  setDados({ ...dados, id_item_ordem_comp: e.target.value })
                }
              >
                <option value="">Selecione selecione uma das opções</option>
                {itensOrdem.map((plano) => (
                  <option key={plano.id_item_ordem_comp} value={plano.id_item_ordem_comp}>
                   Valor: {plano.Valor} - Forma_Pagamento: {plano.Forma_Pagamento}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formValorDebito">
              <Form.Label>Valor Débito</Form.Label>
              <Form.Control
                type="text"
                value={dados.ValorDebito}
                onChange={(e) => {
                  const valor = e.target.value;
                  const regex = /^\d+(\.\d{0,2})?$/; 
                  if (regex.test(valor) || valor === "") {
                    setDados({ ...dados, ValorDebito: valor });
                  }
                }}
                onBlur={(e) => {
                  const valor = e.target.value;
                  if (valor && !valor.includes(".")) {
                    setDados({ ...dados, ValorDebito: `${valor}.00` });
                  } else if (valor && valor.endsWith(".")) {
                    setDados({ ...dados, ValorDebito: `${valor}00` });
                  } else if (valor && valor.match(/^\d+\.\d$/)) {
                    setDados({ ...dados, ValorDebito: `${valor}0` });
                  }
                }}
                placeholder="Digite o valor débito"
              />
            </Form.Group>

                
            <Form.Group controlId="formValorCredito">
              <Form.Label>Valor Crédito</Form.Label>
              <Form.Control
                type="text"
                value={dados.ValorCredito}
                onChange={(e) => {
                  const valor = e.target.value;
                  const regex = /^\d+(\.\d{0,2})?$/; 
                  if (regex.test(valor) || valor === "") {
                    setDados({ ...dados, ValorCredito: valor });
                  }
                }}
                onBlur={(e) => {
                  const valor = e.target.value;
                  if (valor && !valor.includes(".")) {
                    setDados({ ...dados, ValorCredito: `${valor}.00` });
                  } else if (valor && valor.endsWith(".")) {
                    setDados({ ...dados, ValorCredito: `${valor}00` });
                  } else if (valor && valor.match(/^\d+\.\d$/)) {
                    setDados({ ...dados, ValorCredito: `${valor}0` });
                  }
                }}
                placeholder="Digite o valor débito"
              />
            </Form.Group>
            <br/>
            <Button variant="primary" type="submit">
              {isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showErrorModal} onHide={handleErrorModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Erro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleErrorModalClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MovimentoContabil;
