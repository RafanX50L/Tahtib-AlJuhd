import BasicDetails from '../../components/client/Personalization/BasicDetails';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Personalization = () => {
  const [searchParams] = useSearchParams();
  const [path, setPath] = useState(searchParams.get('path'));
  useEffect(() => {
    setPath(searchParams.get('path'));
  }, [searchParams]);

  return (
    <>
      {path === "basic-details" && <BasicDetails />}
    </>
  );
};

export default Personalization;