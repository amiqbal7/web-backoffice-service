import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-50 overflow-hidden flex flex-col items-center justify-center bg-gray-100">
      <Spin size="large" />
      <h2 className="text-center text-xl font-semibold mt-4">Loading...</h2>
      <p className="text-center">This may take a few seconds.</p>
    </div>
  );
}
