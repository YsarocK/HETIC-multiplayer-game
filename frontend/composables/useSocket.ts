import io from 'socket.io-client';

const useSocket = () => {
  const { SOCKET_SERVER_URL } = useRuntimeConfig().public;

  const socket = io(SOCKET_SERVER_URL);

  const emit = (event: string, data: any) => {
    socket.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socket.on(event, callback);
  };
  
  return {
    id: socket.id,
    emit,
    on,
  };
}

export default useSocket