import { BsFillArrowLeftCircleFill } from 'react-icons/bs'
import { useRouter } from 'next/router';
export default function ErrorPage({
  errorCode,
  errorMsg,
}: {
  errorCode: number | string | null;
  errorMsg: string;
}) {
    const router = useRouter()
    const redirect = () => {
        router.push('/market')
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
