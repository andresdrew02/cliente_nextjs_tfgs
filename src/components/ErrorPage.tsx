import { useRouter } from 'next/router';
export default function ErrorPage({
  errorCode,
  errorMsg,
}: {
  errorCode: number | string | null;
  errorMsg: string | null;
}) {
    const router = useRouter()
    const { code, msg } = router.query
    if (code !== null){
      if (!Array.isArray(code) && code !== undefined){
        errorCode = code
      }
      if (!Array.isArray(msg) && msg !== undefined){
        errorMsg=msg
      }
    }
  return (
    <div className="area">
      <div className="w-full flex-col h-screen flex justify-center items-center">
        <div>
          {errorCode !== null && (
            <div className="roll-in-left">
              <h1 className="text-gray-300 text-[10rem]">{errorCode}</h1>
            </div>
          )}
          <div className="roll-in-left-delayed">
            <h2 className="text-center text-gray-300 text-2xl font-bold">
              {errorMsg}
            </h2>
          </div>
        </div>
      </div>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
