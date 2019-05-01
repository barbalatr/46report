import React from "react";
import { TextInput, Select } from "./BasicComponents";
import {
  Navbar,
  Container,
  Button,
  ButtonToolbar,
  Form
} from "react-bootstrap";

export default class Confirmar extends React.Component {
  render() {
    const { values, handleChange, nextStep, prevStep } = this.props;
    return (
      <React.Fragment>
        <Navbar bg="light" variant="dark">
          <h1>Resumo</h1>
        </Navbar>

        <Container>
          <Form>
            <TextInput
              label="Data do Atendimento"
              value={values.dataAtendimento}
              onChange={handleChange("dataAtendimento")}
            />

            <Select
              label="Delegacia"
              value={values.delegacia}
              onChange={handleChange("delegacia")}
              values={[
                "01 Caraguatatuba",
                "02 Caraguatatuba",
                "Ilhabela",
                "São Sebastião",
                "Del. Pol. Ubatuba"
              ]}
            />

            <TextInput
              label="Natureza"
              value={values.natureza}
              onChange={handleChange("natureza")}
            />

            <TextInput
              label="Endereço"
              value={values.endereco}
              onChange={handleChange("endereco")}
            />

            <Select
              label="Fotógrafo"
              value={values.fotografo}
              onChange={handleChange("fotografo")}
              values={["Ana", "Fabio", "Mauro", "Paulo", "Silvia", "Ubirajara"]}
            />
          </Form>
        </Container>

        <ButtonToolbar>
          <Button variant="outline-primary" onClick={prevStep}>
            Voltar
          </Button>
          &nbsp;
          <Button variant="primary" onClick={nextStep}>
            Continuar
          </Button>
        </ButtonToolbar>
      </React.Fragment>
    );
  }
}
