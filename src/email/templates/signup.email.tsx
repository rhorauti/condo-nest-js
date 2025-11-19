import { Button, Container, Html, Text } from '@react-email/components';
import * as React from 'react';

interface SignUpEmailProps {
  name: string;
  url: string;
}

export default function SignUpEmail({ name, url }: SignUpEmailProps) {
  return (
    <Html>
      <Container style={{ display: 'flex', gap: '0.5rem' }}>
        <Text>Olá {name},</Text>
        <Text>Bem vindo ao ConectaCondo!</Text>
        <Text>
          Este é um e-mail automático convidando você para criar um conta na
          nossa aplicação.
        </Text>
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
