// SavingsWallet.js
import React from 'react';
import './SavingsWallet.css';

function SavingsWallet({ savings, wallet, useFromWallet, setUseFromWallet, onResetSavings, onResetWallet }) {
  return (
    <div className="savings-wallet-container">
      <div className="savings-section">
        <h2 className="section-title">Заначка  {savings.toFixed(2)} руб.</h2>
        
        <button className="reset-btn" onClick={onResetSavings}>Сбросить заначку</button>
      </div>
      <div className="wallet-section">
        <h2 className="section-title">Кошелек {wallet.toFixed(2)} руб.</h2>
       
        <button className="reset-btn" onClick={onResetWallet}>Сбросить кошелек</button>
        {wallet > 0 && (
          <div className="use-wallet-input">
            <label className="input-label">Использовать из кошелька для расходов (руб.):</label>
            <input 
              type="number" 
              value={useFromWallet} 
              onChange={(e) => setUseFromWallet(e.target.value)} 
              placeholder="Сумма" 
              min="0" 
              step="0.01" 
              max={wallet} 
              className="wallet-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SavingsWallet;
