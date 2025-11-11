package com.gabriel.api_estacao_meteorologica.entity;

public class SensorData {
    private double temperatura;
    private double umidade;
    private double pressao;

    public SensorData() {}

    public SensorData(double temperatura, double umidade, double pressao) {
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
    }

    public double getTemperatura() { return temperatura; }
    public void setTemperatura(double temperatura) { this.temperatura = temperatura; }

    public double getUmidade() { return umidade; }
    public void setUmidade(double umidade) { this.umidade = umidade; }

    public double getPressao() { return pressao; }
    public void setPressao(double pressao) { this.pressao = pressao; }
}
