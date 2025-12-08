package com.ifsuldeminas.escrud.service.exceptions;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ExceptionsTest {

    @Test
    void testResourceNotFoundException() {
        String mensagemEsperada = "Recurso não encontrado ID 1";

        ResourceNotFoundException exception = new ResourceNotFoundException(mensagemEsperada);

        Assertions.assertEquals(mensagemEsperada, exception.getMessage());
        Assertions.assertTrue(exception instanceof RuntimeException);
    }

    @Test
    void testDatabaseException() {
        String mensagemEsperada = "Violação de integridade de dados";

        DatabaseException exception = new DatabaseException(mensagemEsperada);

        Assertions.assertEquals(mensagemEsperada, exception.getMessage());
        Assertions.assertTrue(exception instanceof RuntimeException);
    }
}