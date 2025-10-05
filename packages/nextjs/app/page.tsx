"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Decentralized Voting</span>
            <span className="block text-4xl font-bold">YourContract (Voting)</span>
          </h1>

          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg mt-4">
            Контракт реализует систему голосования (файл{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts/YourContract.sol
            </code>
            ). Взаимодействие с контрактом:
          </p>
        </div>

        <div className="grow bg-base-300 w-full mt-8 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p className="mt-4">
                Тестируйте контракт через{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <UsersIcon className="h-8 w-8 fill-secondary" />
              <p className="mt-4">
                Чтобы голосовать — вызовите <code>vote(index)</code> для нужного кандидата. Система запрещает повторное голосование с одного адреса.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
