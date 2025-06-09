type Props = {
  message: string;
};

export default function UserMessage({ message }: Props) {
  return (
    <div className="flex justify-end">
      <div className="bg-secondary max-w-3xl p-4 rounded-lg whitespace-pre-wrap">
        {message}
      </div>
    </div>
  );
}
