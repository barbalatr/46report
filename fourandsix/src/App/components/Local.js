import React from "react";
import App from "../App.css";
import {
  TextInput,
  Select,
  DateInput,
  TimeInput,
  CheckBoxInput
} from "./BasicComponents";
import {
  Navbar,
  Container,
  Button,
  ButtonToolbar,
  Form,
  FormGroup
} from "react-bootstrap";
import { Fotografos, Natureza, isPreservado } from "../../Commons";

export default class Local extends React.Component {
  render() {
    const {
      values,
      handleChange,
      handleCheck,
      handleCheckEndereco,
      nextView,
      prevView
    } = this.props;
    return (
      <React.Fragment>
        <Navbar bg="light" variant="dark">
          <h1>Local</h1>
        </Navbar>

        <Container>
          <Form className="App">
            <DateInput
              label="Data do Atendimento"
              value={values.dataAtendimento}
              onChange={handleChange("dataAtendimento")}
            />

            <TimeInput
              label="Hora de Chegada"
              value={values.horaChegada}
              onChange={handleChange("horaChegada")}
            />

            <p>Endereço</p>

            <CheckBoxInput
              label="IC São Sebastião"
              value={values.isLocalIC}
              checked={values.isLocalIC}
              onChange={handleCheckEndereco}
            />

            <TextInput
              label="Endereço"
              value={values.endereco}
              onChange={handleChange("endereco")}
            />
            <TextInput
              label="Número"
              value={values.enderecoNumero}
              onChange={handleChange("enderecoNumero")}
            />
            <TextInput
              label="Cidade"
              value={values.enderecoCidade}
              onChange={handleChange("enderecoCidade")}
            />

            {values.natureza !== "Vistoria" && (
              <div>
                <Select
                  label="Fotógrafo"
                  value={values.fotografo}
                  onChange={handleChange("fotografo")}
                  values={Fotografos}
                />
                <Select
                  label="Preservado"
                  value={values.isPreservado}
                  onChange={handleChange("isPreservado")}
                  values={isPreservado}
                />
                {values.isPreservado === "Sim" && (
                  <div>
                    <TextInput
                      label="Encarregado"
                      value={values.encarregado}
                      onChange={handleChange("encarregado")}
                    />
                    <TextInput
                      label="RE Encarregado"
                      value={values.reEncarregado}
                      onChange={handleChange("reEncarregado")}
                    />
                    <TextInput
                      label="Prefixo Viatura"
                      value={values.prefixoViatura}
                      onChange={handleChange("prefixoViatura")}
                    />
                  </div>
                )}
              </div>
            )}
          </Form>
        </Container>
        <br />
        <ButtonToolbar>
          <Button variant="outline-primary" onClick={prevView}>
            Voltar
          </Button>
          &nbsp;
          <Button variant="primary" onClick={nextView}>
            Continuar
          </Button>
        </ButtonToolbar>
      </React.Fragment>
    );
  }
}
