import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Subjects", () => {
  let userId;
  let subjectId;
  let questionId;

  it("deve criar uma matéria", async () => {
    const userResponse = await request(app)
      .post("/users")
      .send({
        nome: "Professor Teste",
        email: `professor-${Date.now()}@teste.com`,
        papel: "PROFESSOR",
      });

    expect(userResponse.status).toBe(201);
    expect(userResponse.body.success).toBe(true);

    userId = userResponse.body.data.id;

    const response = await request(app).post("/subjects").send({
      nome: "Matéria de Teste",
      professorId: userId,
      ativa: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.nome).toBe("Matéria de Teste");

    subjectId = response.body.data.id;
  });

  it("deve listar as matérias", async () => {
    const response = await request(app).get("/subjects");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("deve buscar uma matéria pelo id", async () => {
    const response = await request(app).get(`/subjects/${subjectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(subjectId);
  });

  it("deve retornar 404 para matéria inexistente", async () => {
    const response = await request(app).get("/subjects/999999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Matéria não encontrada");
  });

  it("deve atualizar parcialmente uma matéria", async () => {
    const response = await request(app).patch(`/subjects/${subjectId}`).send({
      ativa: false,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.ativa).toBe(false);
    expect(response.body.data.nome).toBe("Matéria de Teste");
  });

  it("deve rejeitar PATCH vazio", async () => {
    const response = await request(app)
      .patch(`/subjects/${subjectId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar id inválido", async () => {
    const response = await request(app).get("/subjects/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar matéria com professor inexistente", async () => {
    const response = await request(app).post("/subjects").send({
      nome: "Matéria Inválida",
      professorId: 999999,
      ativa: true,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("não deve permitir excluir matéria que possui questão", async () => {
    const questionResponse = await request(app).post("/questions").send({
      enunciado: "Questão criada para testar exclusão.",
      dificuldade: 1,
      respostaCorreta: "Resposta",
      subjectId,
      authorId: userId,
      ativa: true,
    });

    expect(questionResponse.status).toBe(201);
    questionId = questionResponse.body.data.id;

    const response = await request(app).delete(`/subjects/${subjectId}`);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("deve excluir a questão criada para o teste", async () => {
    const response = await request(app).delete(`/questions/${questionId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("deve excluir a matéria criada para o teste", async () => {
    const response = await request(app).delete(`/subjects/${subjectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("deve retornar 404 ao buscar a matéria excluída", async () => {
    const response = await request(app).get(`/subjects/${subjectId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve excluir o usuário criado para o teste", async () => {
    const response = await request(app).delete(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("Questions", () => {
  let userId;
  let subjectId;
  let questionId;

  it("deve criar os dados necessários para testar uma questão", async () => {
    const userResponse = await request(app)
      .post("/users")
      .send({
        nome: "Autor Teste",
        email: `autor-${Date.now()}@teste.com`,
        papel: "PROFESSOR",
      });

    expect(userResponse.status).toBe(201);

    userId = userResponse.body.data.id;

    const subjectResponse = await request(app).post("/subjects").send({
      nome: "Disciplina Teste",
      professorId: userId,
      ativa: true,
    });

    expect(subjectResponse.status).toBe(201);

    subjectId = subjectResponse.body.data.id;
  });

  it("deve criar uma questão", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Qual é a função do middleware?",
      dificuldade: 2,
      respostaCorreta: "Facilitar a comunicação entre sistemas.",
      subjectId,
      authorId: userId,
      ativa: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.enunciado).toBe("Qual é a função do middleware?");

    questionId = response.body.data.id;
  });

  it("deve listar as questões", async () => {
    const response = await request(app).get("/questions");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("deve buscar uma questão pelo id", async () => {
    const response = await request(app).get(`/questions/${questionId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(questionId);
  });

  it("deve retornar 404 para questão inexistente", async () => {
    const response = await request(app).get("/questions/999999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Questão não encontrada");
  });

  it("deve atualizar parcialmente uma questão", async () => {
    const response = await request(app).patch(`/questions/${questionId}`).send({
      dificuldade: 3,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.dificuldade).toBe(3);
    expect(response.body.data.enunciado).toBe("Qual é a função do middleware?");
  });

  it("deve rejeitar PATCH vazio", async () => {
    const response = await request(app)
      .patch(`/questions/${questionId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar dificuldade inválida", async () => {
    const response = await request(app).patch(`/questions/${questionId}`).send({
      dificuldade: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar matéria inexistente", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão inválida",
      dificuldade: 1,
      respostaCorreta: "Resposta",
      subjectId: 999999,
      authorId: userId,
      ativa: true,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve rejeitar autor inexistente", async () => {
    const response = await request(app).post("/questions").send({
      enunciado: "Questão inválida",
      dificuldade: 1,
      respostaCorreta: "Resposta",
      subjectId,
      authorId: 999999,
      ativa: true,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve excluir a questão", async () => {
    const response = await request(app).delete(`/questions/${questionId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("deve retornar 404 ao buscar a questão excluída", async () => {
    const response = await request(app).get(`/questions/${questionId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("deve excluir a matéria de teste", async () => {
    const response = await request(app).delete(`/subjects/${subjectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("deve excluir o usuário de teste", async () => {
    const response = await request(app).delete(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
