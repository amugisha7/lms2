import React, { useState } from 'react';

const LoanExtensionForm = () => {
  const [extendLoanAfterMaturity, setExtendLoanAfterMaturity] = useState<'yes' | 'no'>('no');

  return (
    <form>
      <label>
        Extend Loan After Maturity:
        <select
          value={extendLoanAfterMaturity}
          onChange={e => setExtendLoanAfterMaturity(e.target.value as 'yes' | 'no')}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </label>
      {/* Related fields */}
      <input
        type="text"
        placeholder="Extension Reason"
        disabled={extendLoanAfterMaturity === 'no'}
      />
      <input
        type="number"
        placeholder="Extension Period"
        disabled={extendLoanAfterMaturity === 'no'}
      />
    </form>
  );
};

export default LoanExtensionForm;