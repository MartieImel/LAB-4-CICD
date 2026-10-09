import { buildGreeting } from '../src/greeting.js';

export default function handler(request, response) {
  const name = request.query?.name ?? 'mundo';

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.status(200).json({
    message: buildGreeting(name)
  });
}