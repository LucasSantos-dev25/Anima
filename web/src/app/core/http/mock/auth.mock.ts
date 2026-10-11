import { LoginRequest, RegisterRequest, User } from '@core/auth/auth.models';
import { MockHandler, mockFail, mockOk } from './mock-utils';

let profile: User = {
  id: 1,
  name: 'Paciente Teste',
  email: 'teste@anima.com',
  phone: '11999999999',
  birthDate: '1995-05-20',
};

export const authMockHandler: MockHandler = (req, path) => {
  if (req.method === 'POST' && path === '/auth/register') {
    const body = req.body as RegisterRequest;
    if (body.email === 'erro@anima.com') {
      return mockFail(409, 'E-mail já cadastrado.');
    }
    profile = { ...profile, name: body.name, email: body.email };
    return mockOk(null, 201);
  }

  if (req.method === 'POST' && path === '/auth/login') {
    const body = req.body as LoginRequest;
    if (body.password === 'errada123') {
      return mockFail(401, 'Credenciais inválidas.');
    }
    return mockOk({ token: 'mock-token' });
  }

  if (req.method === 'GET' && path === '/users/me') {
    return mockOk(profile);
  }

  if (req.method === 'PUT' && path === '/users/me') {
    profile = { ...profile, ...(req.body as Partial<User>) };
    return mockOk(profile);
  }

  return null;
};