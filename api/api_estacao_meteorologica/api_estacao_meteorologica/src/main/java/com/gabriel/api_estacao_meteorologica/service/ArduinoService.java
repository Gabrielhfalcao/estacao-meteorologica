package com.gabriel.api_estacao_meteorologica.service;

import com.gabriel.api_estacao_meteorologica.entity.SensorData;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import com.fazecast.jSerialComm.SerialPort;

@Service
public class ArduinoService {

    private final SensorData ultimaLeitura = new SensorData();

    public SensorData getUltimaLeitura() {
        return ultimaLeitura;
    }

    @PostConstruct
    public void iniciarLeitura() {
        new Thread(() -> {
            SerialPort comPort = SerialPort.getCommPort("COM3"); // ajuste conforme sua porta
            comPort.setBaudRate(9600);
            comPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 2000, 0); // espera até 2s por dados

            if (!comPort.openPort()) {
                System.err.println("❌ Não foi possível abrir a porta COM3.");
                return;
            }

            System.out.println("✅ Porta COM3 aberta. Lendo dados...");

            StringBuilder sb = new StringBuilder();

            while (true) {
                try {
                    int bytesAvailable = comPort.bytesAvailable();
                    if (bytesAvailable > 0) {
                        byte[] buffer = new byte[bytesAvailable];
                        int numRead = comPort.readBytes(buffer, buffer.length);
                        sb.append(new String(buffer, 0, numRead));

                        // Processa linhas completas
                        int index;
                        while ((index = sb.indexOf("\n")) != -1) {
                            String line = sb.substring(0, index).trim();
                            sb.delete(0, index + 1);
                            if (line.startsWith("TEMP")) {
                                processarLinha(line);
                            }
                        }
                    }
                    Thread.sleep(100); // evita loop muito rápido
                } catch (Exception e) {
                    System.err.println("⚠️ Erro na leitura serial: " + e.getMessage());
                }
            }

        }).start();
    }

    private void processarLinha(String dados) {
        try {
            // Exemplo de linha: TEMP:25.4;UMID:55.2;PRESS:1013.25
            String[] partes = dados.split(";");
            double temp = Double.parseDouble(partes[0].split(":")[1]);
            double umid = Double.parseDouble(partes[1].split(":")[1]);
            double press = Double.parseDouble(partes[2].split(":")[1]);

            ultimaLeitura.setTemperatura(temp);
            ultimaLeitura.setUmidade(umid);
            ultimaLeitura.setPressao(press);

            System.out.println("📡 Leitura atualizada: " + temp + " °C, " + umid + " %, " + press + " hPa");
        } catch (Exception e) {
            System.err.println("⚠️ Falha ao processar linha: " + dados + " -> " + e.getMessage());
        }
    }
}