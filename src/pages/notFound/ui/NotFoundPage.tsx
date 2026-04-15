import Button from '@/shared/ui/Button';
import { useNavigate } from 'react-router';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>

      <p className="text-lg text-gray-600">페이지를 찾을 수 없습니다.</p>

      <Button onClick={() => navigate('/')}>메인 페이지로 이동</Button>
    </div>
  );
}

export default NotFoundPage;
