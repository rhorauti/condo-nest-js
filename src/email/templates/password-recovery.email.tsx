import { Button, Container, Html, Text } from '@react-email/components';
import * as React from 'react';

interface PasswordRecoveryProps {
  name: string;
  url: string;
}

export default function PasswordRecoveryEmail({
  name,
  url,
}: PasswordRecoveryProps) {
  return (
    <Html>
      <Container style={{ display: 'flex', gap: '0.5rem' }}>
        <Text>Olá {name},</Text>
        <Text>Bem vindo ao ConectaCondo!</Text>
        <Text>Este é um e-mail automático de recuperação de e-mail.</Text>
        <Button
          href={url}
          style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
        >
          Redirecionar
        </Button>
      </Container>
    </Html>
  );
}
