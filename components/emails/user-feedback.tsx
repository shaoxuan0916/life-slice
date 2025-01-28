import React from "react";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface UserFeedbackEmailProps {
  email: string;
  name: string;
  message: string;
}

const UserFeedbackEmail = ({
  email,
  name,
  message,
}: UserFeedbackEmailProps) => {
  return (
    <Html>
      <Head>
        <Preview>Feedback from user.</Preview>
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {},
            },
          },
        }}
      >
        <Body>
          <Container>
            <Section>
              <Row>
                <Column>
                  <Heading>Feedback from user</Heading>
                  <Text>Name: {name}</Text>
                  <Text>Email: {email}</Text>
                  <Text>Message: {message}</Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserFeedbackEmail;
