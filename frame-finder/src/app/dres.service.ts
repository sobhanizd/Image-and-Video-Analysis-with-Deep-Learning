import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  sessionId: string;
}

interface Evaluation {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class DresService {

  private apiUrl = 'https://vbs.videobrowsing.org/api/v2';
  private sessionToken: string | null = null;
  private evaluationId: string | null = null;

  constructor() {
    this.login(); // automatically log in on page reload
  }

  private async login(): Promise<void> {
    const username = 'ivadl03';
    const password = '8g4TikwAbiD6V6n';

    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(`${this.apiUrl}/login`, { username, password });
      this.sessionToken = response.data.sessionId;
      console.log('Login successful:', response.data);
      console.log(this.sessionToken);
      await this.queryActiveEvaluations();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }

  private async queryActiveEvaluations(): Promise<void> {
    if (!this.sessionToken) {
      throw new Error('User not logged in');
    }

    try {
      const response: AxiosResponse<Evaluation[]> = await axios.get(
        `${this.apiUrl}/client/evaluation/list`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            session: this.sessionToken
          }
        }
      );

      const evaluations = response.data;
      this.evaluationId = 'IVADL2024';

      // check if "IVADL2024" is in list of evaluations
      const evaluation = evaluations.find(evaluation => evaluation.id === 'IVADL2024');
      if (!evaluation && evaluations.length > 0) {
        this.evaluationId = evaluations[0].id; // Use the first evaluation ID if "IVADL2024" is not found
      }

      console.log('Active evaluation ID:', this.evaluationId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error querying evaluations:', error.response ? error.response.data : error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }

  public async submit(taskName: string, mediaItemName: string, start: number, end: number): Promise<void> {
    if (!this.sessionToken) {
      throw new Error('User not logged in');
    }

    if (!this.evaluationId) {
      throw new Error('No active evaluation ID found');
    }

    const submissionData = {
      answerSets: [
        {
          taskName: taskName,
          answers: [
            {
              text: null,
              mediaItemName: mediaItemName,
              mediaItemCollectionName: 'IVADL',
              start: start,
              end: end
            }
          ]
        }
      ]
    };

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${this.apiUrl}/submit/${this.evaluationId}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            session: this.sessionToken
          }
        }
      );
      console.log('Submission successful:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting data:', error.response ? error.response.data : error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }
}
