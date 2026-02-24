/**
 * @module pinion
 * Server-side PinionOS integration with real x402 micropayments on Base Sepolia.
 *
 * Combines the PinionOS SDK (wallet derivation, network config) with
 * direct ethers.js calls for verifiable on-chain USDC transfers.
 *
 * This module is SERVER-ONLY — reads PINION_PRIVATE_KEY from env.
 */

import { PinionClient } from "pinion-os";
import { ethers } from "ethers";
import { BASE_SEPOLIA, ERC20_ABI, PAYMENT_CONFIG } from "./constants";

/* ─── Singletons ──────────────────────────────────────────────────── */

let _client: PinionClient | null = null;
let _provider: ethers.JsonRpcProvider | null = null;
let _signer: ethers.Wallet | null = null;

/** Normalise private key to 0x-prefixed hex. */
function getPrivateKey(): string {
  const raw = process.env.PINION_PRIVATE_KEY;
  if (!raw) {
    throw new Error(
      "[PinionOS] PINION_PRIVATE_KEY env variable is required. " +
        "Set a hex private key with USDC on Base Sepolia."
    );
  }
  return raw.startsWith("0x") ? raw : `0x${raw}`;
}

/** JSON-RPC provider connected to Base Sepolia. */
export function getProvider(): ethers.JsonRpcProvider {
  if (!_provider) {
    _provider = new ethers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl, {
      chainId: BASE_SEPOLIA.chainId,
      name: "base-sepolia",
    });
  }
  return _provider;
}

/** PinionOS client configured for Base Sepolia. */
export function getPinionClient(): PinionClient {
  if (!_client) {
    _client = new PinionClient({
      privateKey: getPrivateKey(),
      network: "base-sepolia",
    });
  }
  return _client;
}

/** Ethers Wallet connected to the Base Sepolia provider. */
export function getSigner(): ethers.Wallet {
  if (!_signer) {
    _signer = new ethers.Wallet(getPrivateKey(), getProvider());
  }
  return _signer;
}

/** Agent's derived wallet address. */
export function getAgentAddress(): string {
  return getSigner().address;
}

/* ─── On-chain Balance Queries ────────────────────────────────────── */

/** Read native ETH balance, formatted as a decimal string. */
export async function getETHBalance(address: string): Promise<string> {
  const balance = await getProvider().getBalance(address);
  return ethers.formatEther(balance);
}

/** Read USDC balance on Base Sepolia, formatted as a decimal string. */
export async function getUSDCBalance(address: string): Promise<string> {
  const usdc = new ethers.Contract(
    BASE_SEPOLIA.usdcAddress,
    ERC20_ABI,
    getProvider(),
  );
  const balance: bigint = await usdc.balanceOf(address);
  return ethers.formatUnits(balance, BASE_SEPOLIA.usdcDecimals);
}

/** Convenience: fetch both balances + metadata for a given address. */
export async function getWalletInfo(address?: string) {
  const addr = address ?? getAgentAddress();
  const [ethBalance, usdcBalance] = await Promise.all([
    getETHBalance(addr),
    getUSDCBalance(addr),
  ]);
  return {
    address: addr,
    ethBalance,
    usdcBalance,
    network: BASE_SEPOLIA.name,
    chainId: BASE_SEPOLIA.chainId,
  };
}

/* ─── Payment Receipt ─────────────────────────────────────────────── */

export interface PaymentReceipt {
  success: boolean;
  txHash: string;
  from: string;
  to: string;
  amount: string;
  gasUsed: string;
  blockNumber: number;
  confirmations: number;
  explorerUrl: string;
  error?: string;
}

/* ─── Real x402 Payment Processing ────────────────────────────────── */

/**
 * Sends a real $0.01 USDC micropayment on Base Sepolia.
 *
 * 1. Calls `USDC.transfer(recipient, 10 000)` — 0.01 USDC (6 decimals).
 * 2. Waits for 1 block confirmation.
 * 3. Returns the full on-chain receipt for verification.
 *
 * Throws user-friendly errors on insufficient balance or reverts.
 */
export async function processPayment(): Promise<PaymentReceipt> {
  const signer = getSigner();
  const from = signer.address;
  const to = PAYMENT_CONFIG.recipient;

  /* ── Pre-flight: check USDC balance ──────────────────────── */
  const balance = await getUSDCBalance(from);
  const balanceFloat = parseFloat(balance);
  const costFloat = parseFloat(PAYMENT_CONFIG.amountUSDC);

  if (balanceFloat < costFloat) {
    return {
      success: false,
      txHash: "0x",
      from,
      to,
      amount: PAYMENT_CONFIG.amountUSDC,
      gasUsed: "0",
      blockNumber: 0,
      confirmations: 0,
      explorerUrl: "",
      error:
        `Insufficient USDC balance: ${balance} USDC available, ` +
        `${PAYMENT_CONFIG.amountUSDC} USDC required. ` +
        `Fund your wallet at https://faucet.circle.com (Base Sepolia).`,
    };
  }

  /* ── Check ETH for gas ───────────────────────────────────── */
  const ethBalance = await getETHBalance(from);
  if (parseFloat(ethBalance) < 0.0001) {
    return {
      success: false,
      txHash: "0x",
      from,
      to,
      amount: PAYMENT_CONFIG.amountUSDC,
      gasUsed: "0",
      blockNumber: 0,
      confirmations: 0,
      explorerUrl: "",
      error:
        `Insufficient ETH for gas: ${ethBalance} ETH. ` +
        `Get testnet ETH from https://www.alchemy.com/faucets/base-sepolia`,
    };
  }

  /* ── Send USDC transfer ──────────────────────────────────── */
  const usdc = new ethers.Contract(
    BASE_SEPOLIA.usdcAddress,
    ERC20_ABI,
    signer,
  );

  const tx = await usdc.transfer(to, PAYMENT_CONFIG.amountAtomic);

  /* ── Wait for confirmation ───────────────────────────────── */
  const receipt = await tx.wait(PAYMENT_CONFIG.requiredConfirmations);

  if (!receipt || receipt.status !== 1) {
    return {
      success: false,
      txHash: tx.hash,
      from,
      to,
      amount: PAYMENT_CONFIG.amountUSDC,
      gasUsed: receipt?.gasUsed?.toString() ?? "0",
      blockNumber: receipt?.blockNumber ?? 0,
      confirmations: 0,
      explorerUrl: `${BASE_SEPOLIA.explorer}/tx/${tx.hash}`,
      error: "Transaction reverted on-chain. Check BaseScan for details.",
    };
  }

  return {
    success: true,
    txHash: receipt.hash,
    from,
    to,
    amount: PAYMENT_CONFIG.amountUSDC,
    gasUsed: receipt.gasUsed.toString(),
    blockNumber: receipt.blockNumber,
    confirmations: PAYMENT_CONFIG.requiredConfirmations,
    explorerUrl: `${BASE_SEPOLIA.explorer}/tx/${receipt.hash}`,
  };
}

/* ─── On-chain Transaction Verification ───────────────────────────── */

export interface TxVerification {
  verified: boolean;
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  from: string;
  to: string | null;
  status: "confirmed" | "reverted" | "not-found";
}

/**
 * Independently verify a transaction on Base Sepolia.
 * Judges can cross-check this against BaseScan.
 */
export async function verifyTransaction(
  txHash: string,
): Promise<TxVerification> {
  const provider = getProvider();
  const receipt = await provider.getTransactionReceipt(txHash);

  if (!receipt) {
    return {
      verified: false,
      txHash,
      blockNumber: 0,
      gasUsed: "0",
      from: "",
      to: null,
      status: "not-found",
    };
  }

  return {
    verified: receipt.status === 1,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    from: receipt.from,
    to: receipt.to,
    status: receipt.status === 1 ? "confirmed" : "reverted",
  };
}
